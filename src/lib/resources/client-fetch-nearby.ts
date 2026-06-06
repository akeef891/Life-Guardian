import { parseNearbyResourcesApiResponse } from "@/lib/services/emergency-resources-api";
import type { NearbyResourcesResult } from "@/lib/services/emergency-resources.service";

export type NearbyResourcesFetchResult = {
  data: NearbyResourcesResult | null;
  unavailable: boolean;
  error: string | null;
  diagnostics: NearbyResourcesDiagnostics;
};

export type NearbyResourcesDiagnostics = {
  lat: number | null;
  lng: number | null;
  httpStatus: number | null;
  hospitalCount: number;
  policeCount: number;
  ambulanceCount: number;
  unavailable: boolean;
  durationMs: number;
};

const LOG_PREFIX = "[resources/client]";

function emptyDiagnostics(): NearbyResourcesDiagnostics {
  return {
    lat: null,
    lng: null,
    httpStatus: null,
    hospitalCount: 0,
    policeCount: 0,
    ambulanceCount: 0,
    unavailable: false,
    durationMs: 0,
  };
}

export async function fetchNearbyResourcesClient(
  lat: number,
  lng: number,
  radius = 12000,
): Promise<NearbyResourcesFetchResult> {
  const started = Date.now();
  const diagnostics = emptyDiagnostics();
  diagnostics.lat = lat;
  diagnostics.lng = lng;

  try {
    const response = await fetch(
      `/api/resources/nearby?lat=${lat}&lng=${lng}&radius=${radius}`,
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
      };
    }

    diagnostics.hospitalCount = parsed.hospitals.length;
    diagnostics.policeCount = parsed.police.length;
    diagnostics.ambulanceCount = parsed.ambulances.length;
    diagnostics.unavailable = Boolean(parsed.unavailable);
    diagnostics.durationMs = Date.now() - started;

    logDiagnostics(diagnostics, parsed.unavailable ? "upstream unavailable" : "ok");

    return {
      data: parsed,
      unavailable: Boolean(parsed.unavailable),
      error: null,
      diagnostics,
    };
  } catch (error) {
    diagnostics.durationMs = Date.now() - started;
    const message = error instanceof Error ? error.message : "Network error";
    logDiagnostics(diagnostics, message);
    return {
      data: null,
      unavailable: true,
      error: message,
      diagnostics,
    };
  }
}

function logDiagnostics(diagnostics: NearbyResourcesDiagnostics, note: string) {
  if (process.env.NODE_ENV === "production") {
    return;
  }
  console.info(LOG_PREFIX, note, diagnostics);
}

export function requestUserCoordinates(
  options: PositionOptions = {
    enableHighAccuracy: true,
    timeout: 15000,
    maximumAge: 120000,
  },
): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation unsupported"));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
}
