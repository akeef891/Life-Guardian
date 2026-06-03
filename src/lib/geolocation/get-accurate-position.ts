export type GeolocationSuccess = {
  ok: true;
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
};

export type GeolocationFailure = {
  ok: false;
  reason: "permission-denied" | "unavailable" | "timeout" | "unsupported" | "failed";
};

export type GeolocationResult = GeolocationSuccess | GeolocationFailure;

const GEO_OPTIONS: PositionOptions = {
  enableHighAccuracy: true,
  timeout: 15_000,
  maximumAge: 0,
};

/** Retry once when the first fix is worse than this threshold (meters). */
const POOR_ACCURACY_METERS = 80;

function mapGeolocationError(error: GeolocationPositionError): GeolocationFailure["reason"] {
  if (error.code === error.PERMISSION_DENIED) {
    return "permission-denied";
  }
  if (error.code === error.POSITION_UNAVAILABLE) {
    return "unavailable";
  }
  if (error.code === error.TIMEOUT) {
    return "timeout";
  }
  return "failed";
}

function getCurrentPositionOnce(): Promise<GeolocationResult> {
  return new Promise((resolve) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      resolve({ ok: false, reason: "unsupported" });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          ok: true,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        });
      },
      (error) => {
        resolve({ ok: false, reason: mapGeolocationError(error) });
      },
      GEO_OPTIONS,
    );
  });
}

/**
 * Uses getCurrentPosition with high accuracy settings.
 * Retries once when the first reading accuracy is poor.
 */
export async function getAccuratePosition(): Promise<GeolocationResult> {
  const first = await getCurrentPositionOnce();

  if (!first.ok) {
    return first;
  }

  if (first.accuracy <= POOR_ACCURACY_METERS) {
    return first;
  }

  const retry = await getCurrentPositionOnce();
  if (!retry.ok) {
    return first;
  }

  return retry.accuracy < first.accuracy ? retry : first;
}

/** Full precision for map URLs (~1cm at equator with 7 decimals). */
export function formatCoordForMaps(value: number): string {
  return value.toFixed(7);
}

export function buildGoogleMapsUrl(latitude: number, longitude: number): string {
  const lat = formatCoordForMaps(latitude);
  const lng = formatCoordForMaps(longitude);
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
}

export function formatAccuracyLabel(accuracy: number | null | undefined): string {
  if (accuracy == null || !Number.isFinite(accuracy)) {
    return "Unknown accuracy";
  }
  if (accuracy < 20) {
    return `High accuracy (±${Math.round(accuracy)}m)`;
  }
  if (accuracy < 80) {
    return `Moderate accuracy (±${Math.round(accuracy)}m)`;
  }
  return `Low accuracy (±${Math.round(accuracy)}m) — GPS may be off by ~100m indoors`;
}
