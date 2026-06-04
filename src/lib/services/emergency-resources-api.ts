import type { EmergencyResource, NearbyResourcesResult } from "./emergency-resources.service";

export type NearbyResourcesApiResponse = {
  success: true;
  resources: EmergencyResource[];
  hospitals: EmergencyResource[];
  police: EmergencyResource[];
  ambulances: EmergencyResource[];
  userLatitude: number;
  userLongitude: number;
  unavailable?: boolean;
};

export function flattenResources(result: NearbyResourcesResult): EmergencyResource[] {
  return [...result.hospitals, ...result.police, ...result.ambulances];
}

export function toNearbyResourcesApiResponse(
  result: NearbyResourcesResult & { unavailable?: boolean },
): NearbyResourcesApiResponse {
  return {
    success: true,
    resources: flattenResources(result),
    hospitals: result.hospitals,
    police: result.police,
    ambulances: result.ambulances,
    userLatitude: result.userLatitude,
    userLongitude: result.userLongitude,
    ...(result.unavailable ? { unavailable: true } : {}),
  };
}

export function createEmptyNearbyResult(
  latitude: number,
  longitude: number,
): NearbyResourcesResult & { unavailable: true } {
  return {
    hospitals: [],
    police: [],
    ambulances: [],
    userLatitude: latitude,
    userLongitude: longitude,
    unavailable: true,
  };
}

export function parseNearbyResourcesApiResponse(
  json: unknown,
): (NearbyResourcesResult & { unavailable?: boolean }) | null {
  if (!json || typeof json !== "object") {
    return null;
  }
  const body = json as Record<string, unknown>;
  if (body.success !== true) {
    return null;
  }

  const userLatitude = Number(body.userLatitude);
  const userLongitude = Number(body.userLongitude);
  if (!Number.isFinite(userLatitude) || !Number.isFinite(userLongitude)) {
    return null;
  }

  const hospitals = Array.isArray(body.hospitals) ? (body.hospitals as EmergencyResource[]) : [];
  const police = Array.isArray(body.police) ? (body.police as EmergencyResource[]) : [];
  const ambulances = Array.isArray(body.ambulances)
    ? (body.ambulances as EmergencyResource[])
    : [];

  return {
    hospitals,
    police,
    ambulances,
    userLatitude,
    userLongitude,
    unavailable: body.unavailable === true,
  };
}
