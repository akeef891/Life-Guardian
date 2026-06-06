import { getLocationQuality } from "@/lib/geolocation/location-quality";

export type GeolocationSuccess = {
  ok: true;
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
  attempts: number;
};

export type GeolocationFailure = {
  ok: false;
  reason: "permission-denied" | "unavailable" | "timeout" | "unsupported" | "failed";
  attempts: number;
};

export type GeolocationResult = GeolocationSuccess | GeolocationFailure;

/** Production GPS settings — accuracy over speed, no cached fixes. */
export const HIGH_ACCURACY_GEO_OPTIONS: PositionOptions = {
  enableHighAccuracy: true,
  timeout: 30_000,
  maximumAge: 0,
};

const MAX_ATTEMPTS = 3;
const RETRY_IF_ACCURACY_M = 100;
const IMPROVE_IF_ACCURACY_M = 50;
const GPS_RETRY_DELAY_MS = 800;

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

function getCurrentPositionOnce(
  options: PositionOptions = HIGH_ACCURACY_GEO_OPTIONS,
): Promise<GeolocationResult> {
  return new Promise((resolve) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      resolve({ ok: false, reason: "unsupported", attempts: 0 });
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
          attempts: 1,
        });
      },
      (error) => {
        resolve({ ok: false, reason: mapGeolocationError(error), attempts: 1 });
      },
      options,
    );
  });
}

function isBetterReading(
  candidate: GeolocationSuccess,
  current: GeolocationSuccess | null,
): boolean {
  if (!current) {
    return true;
  }
  return candidate.accuracy < current.accuracy;
}

function shouldContinueAttempts(
  best: GeolocationSuccess,
  attempt: number,
): boolean {
  if (attempt >= MAX_ATTEMPTS) {
    return false;
  }
  if (best.accuracy > RETRY_IF_ACCURACY_M) {
    return true;
  }
  if (best.accuracy > IMPROVE_IF_ACCURACY_M) {
    return true;
  }
  return false;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Acquires the best available GPS fix using getCurrentPosition only.
 * Up to 3 attempts; retries when accuracy > 100m, improves when > 50m.
 */
export async function getAccuratePosition(): Promise<GeolocationResult> {
  let best: GeolocationSuccess | null = null;
  let lastFailure: GeolocationFailure | null = null;
  let attempts = 0;

  while (attempts < MAX_ATTEMPTS) {
    if (attempts > 0) {
      await delay(GPS_RETRY_DELAY_MS);
    }

    attempts += 1;
    const reading = await getCurrentPositionOnce();

    if (!reading.ok) {
      lastFailure = { ...reading, attempts };
      continue;
    }

    const success: GeolocationSuccess = { ...reading, attempts };

    if (isBetterReading(success, best)) {
      best = success;
    }

    if (best && !shouldContinueAttempts(best, attempts)) {
      break;
    }
  }

  if (best) {
    return { ...best, attempts };
  }

  return (
    lastFailure ?? {
      ok: false,
      reason: "failed",
      attempts,
    }
  );
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

export { formatLocationQualityLabel as formatAccuracyLabel } from "@/lib/geolocation/location-quality";

export function getAccuracyQuality(accuracyM: number | null | undefined) {
  if (accuracyM == null || !Number.isFinite(accuracyM)) {
    return null;
  }
  return getLocationQuality(accuracyM);
}
