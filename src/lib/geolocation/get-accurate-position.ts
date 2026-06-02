export type GeolocationResult =
  | {
      ok: true;
      latitude: number;
      longitude: number;
      accuracy: number;
    }
  | {
      ok: false;
      reason: "permission-denied" | "unavailable" | "timeout" | "unsupported" | "failed";
    };

const TARGET_ACCURACY_METERS = 30;
const MAX_WAIT_MS = 22_000;

/**
 * Uses watchPosition to collect readings and returns the most accurate fix,
 * or the best fix after timeout. Improves on a single quick getCurrentPosition
 * (which often returns network/cell location ~50–150m off).
 */
export function getAccuratePosition(): Promise<GeolocationResult> {
  return new Promise((resolve) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      resolve({ ok: false, reason: "unsupported" });
      return;
    }

    let best: GeolocationPosition | null = null;
    let watchId: number | null = null;
    let settled = false;

    const finish = (result: GeolocationResult) => {
      if (settled) {
        return;
      }
      settled = true;
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
      resolve(result);
    };

    const timeoutId = window.setTimeout(() => {
      if (best) {
        finish({
          ok: true,
          latitude: best.coords.latitude,
          longitude: best.coords.longitude,
          accuracy: best.coords.accuracy,
        });
      } else {
        finish({ ok: false, reason: "timeout" });
      }
    }, MAX_WAIT_MS);

    const onSuccess = (position: GeolocationPosition) => {
      if (!best || position.coords.accuracy < best.coords.accuracy) {
        best = position;
      }

      if (position.coords.accuracy <= TARGET_ACCURACY_METERS) {
        window.clearTimeout(timeoutId);
        finish({
          ok: true,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      }
    };

    const onError = (error: GeolocationPositionError) => {
      if (error.code === error.PERMISSION_DENIED) {
        window.clearTimeout(timeoutId);
        if (best) {
          finish({
            ok: true,
            latitude: best.coords.latitude,
            longitude: best.coords.longitude,
            accuracy: best.coords.accuracy,
          });
        } else {
          finish({ ok: false, reason: "permission-denied" });
        }
        return;
      }
      // Transient errors during watch: keep waiting until timeout picks best fix.
    };

    watchId = navigator.geolocation.watchPosition(onSuccess, onError, {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: MAX_WAIT_MS,
    });
  });
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
