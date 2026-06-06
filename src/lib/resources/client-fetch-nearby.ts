import { getAccuratePosition, type GeolocationSuccess } from "@/lib/geolocation/get-accurate-position";
import { parseNearbyResourcesApiResponse } from "@/lib/services/emergency-resources-api";
import type { NearbyResourcesResult } from "@/lib/services/emergency-resources.service";

export type NearbyResourcesFetchResult = {
  data: NearbyResourcesResult | null;
  unavailable: boolean;
  error: string | null;
  diagnostics: NearbyResourcesDiagnostics;
  gps: GeolocationSuccess | null;
};

export type NearbyResourcesDiagnostics = {
  lat: number | null;
  lng: number | null;
  accuracyM: number | null;
  gpsAttempts: number | null;
  httpStatus: number | null;
  hospitalCount: number;
  policeCount: number;
  ambulanceCount: number;
  searchRadiusM: number | null;
  unavailable: boolean;
  durationMs: number;
  cacheHit: boolean;
};

const LOG_PREFIX = "[resources/client]";
const CACHE_TTL_MS = 2 * 60 * 1000;

type CacheEntry = {
  expiresAt: number;
  result: NearbyResourcesFetchResult;
};

const resourceCache = new Map<string, CacheEntry>();

function emptyDiagnostics(): NearbyResourcesDiagnostics {
  return {
    lat: null,
    lng: null,
    accuracyM: null,
    gpsAttempts: null,
    httpStatus: null,
    hospitalCount: 0,
    policeCount: 0,
    ambulanceCount: 0,
    searchRadiusM: null,
    unavailable: false,
    durationMs: 0,
    cacheHit: false,
  };
}

function cacheKey(lat: number, lng: number): string {
  return `${lat.toFixed(5)},${lng.toFixed(5)}`;
}

function getCached(lat: number, lng: number): NearbyResourcesFetchResult | null {
  const entry = resourceCache.get(cacheKey(lat, lng));
  if (!entry || entry.expiresAt <= Date.now()) {
    if (entry) {
      resourceCache.delete(cacheKey(lat, lng));
    }
    return null;
  }
  return {
    ...entry.result,
    diagnostics: { ...entry.result.diagnostics, cacheHit: true },
  };
}

function setCache(lat: number, lng: number, result: NearbyResourcesFetchResult) {
  if (!result.data || result.unavailable) {
    return;
  }
  resourceCache.set(cacheKey(lat, lng), {
    expiresAt: Date.now() + CACHE_TTL_MS,
    result,
  });
}

export async function acquireHighAccuracyGps() {
  return getAccuratePosition();
}

export async function fetchNearbyResourcesClient(
  lat: number,
  lng: number,
  gps: GeolocationSuccess | null = null,
): Promise<NearbyResourcesFetchResult> {
  const started = Date.now();
  const diagnostics = emptyDiagnostics();
  diagnostics.lat = lat;
  diagnostics.lng = lng;
  diagnostics.accuracyM = gps?.accuracy ?? null;
  diagnostics.gpsAttempts = gps?.attempts ?? null;

  const cached = getCached(lat, lng);
  if (cached) {
    logDiagnostics(cached.diagnostics, "cache hit");
    return cached;
  }

  try {
    const response = await fetch(
      `/api/resources/nearby?lat=${lat}&lng=${lng}`,
      { cache: "no-store" },
    );
    diagnostics.httpStatus = response.status;
    const json: unknown = await response.json();
    const parsed = parseNearbyResourcesApiResponse(json);

    if (!parsed) {
      diagnostics.durationMs = Date.now() - started;
      logDiagnostics(diagnostics, "invalid response shape");
      return {
        data: null,
        unavailable: false,
        error: "Invalid API response",
        diagnostics,
        gps,
      };
    }

    diagnostics.hospitalCount = parsed.hospitals.length;
    diagnostics.policeCount = parsed.police.length;
    diagnostics.ambulanceCount = parsed.ambulances.length;
    diagnostics.searchRadiusM = parsed.meta?.searchRadiusM ?? null;
    diagnostics.unavailable = Boolean(parsed.unavailable);
    diagnostics.durationMs = Date.now() - started;

    logDiagnostics(diagnostics, parsed.unavailable ? "upstream unavailable" : "ok");

    const result: NearbyResourcesFetchResult = {
      data: parsed,
      unavailable: Boolean(parsed.unavailable),
      error: null,
      diagnostics,
      gps,
    };

    setCache(lat, lng, result);
    return result;
  } catch (error) {
    diagnostics.durationMs = Date.now() - started;
    const message = error instanceof Error ? error.message : "Network error";
    logDiagnostics(diagnostics, message);
    return {
      data: null,
      unavailable: true,
      error: message,
      diagnostics,
      gps,
    };
  }
}

function logDiagnostics(diagnostics: NearbyResourcesDiagnostics, note: string) {
  if (process.env.NODE_ENV === "production") {
    return;
  }
  console.info(LOG_PREFIX, note, diagnostics);
}

/** High-accuracy GPS then progressive-radius resource fetch. */
export async function loadResourcesWithHighAccuracyGps(): Promise<NearbyResourcesFetchResult> {
  const gps = await acquireHighAccuracyGps();
  if (!gps.ok) {
    return {
      data: null,
      unavailable: false,
      error: gps.reason,
      diagnostics: {
        ...emptyDiagnostics(),
        gpsAttempts: gps.attempts,
      },
      gps: null,
    };
  }

  return fetchNearbyResourcesClient(gps.latitude, gps.longitude, gps);
}
