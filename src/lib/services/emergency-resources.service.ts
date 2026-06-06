export type EmergencyResourceType = "hospital" | "police" | "ambulance";

export type EmergencyResource = {
  id: string;
  type: EmergencyResourceType;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  distanceKm: number;
  mapsUrl: string;
};

export type NearbyResourcesResult = {
  hospitals: EmergencyResource[];
  police: EmergencyResource[];
  ambulances: EmergencyResource[];
  userLatitude: number;
  userLongitude: number;
  unavailable?: boolean;
  meta?: NearbyResourcesMeta;
};

export type NearbyResourcesMeta = {
  durationMs: number;
  elementCount: number;
  endpoint?: string;
  attempts: number;
};

const EARTH_RADIUS_KM = 6371;
export const DEFAULT_RADIUS_M = 12_000;
const MAX_PER_TYPE = 12;
const FETCH_TIMEOUT_MS = 18_000;
const RETRY_DELAY_MS = 600;
const MAX_ATTEMPTS_PER_ENDPOINT = 2;
const LOG_PREFIX = "[emergency-resources]";

const OVERPASS_ENDPOINTS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
  "https://overpass.openstreetmap.fr/api/interpreter",
];

const NOMINATIM_REVERSE =
  "https://nominatim.openstreetmap.org/reverse?format=json&lat={lat}&lon={lon}";

const OVERPASS_USER_AGENT = "LifeGuardian/1.0 (emergency-app; contact@lifeguardian.app)";

type OverpassElement = {
  type: string;
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
};

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function buildMapsUrl(lat: number, lon: number): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`;
}

function elementCoords(el: OverpassElement): { lat: number; lon: number } | null {
  if (el.lat != null && el.lon != null) {
    return { lat: el.lat, lon: el.lon };
  }
  if (el.center) {
    return { lat: el.center.lat, lon: el.center.lon };
  }
  return null;
}

function formatAddress(tags: Record<string, string> | undefined): string {
  if (!tags) {
    return "Address unavailable";
  }
  const parts = [
    tags["addr:housenumber"],
    tags["addr:street"],
    tags["addr:city"] ?? tags["addr:town"] ?? tags["addr:village"],
    tags["addr:state"],
  ].filter(Boolean);
  if (parts.length > 0) {
    return parts.join(", ");
  }
  return tags["addr:full"] ?? tags["address"] ?? "Address unavailable";
}

function buildOverpassQuery(lat: number, lon: number, radiusM: number): string {
  return `
[out:json][timeout:15];
(
  node["amenity"="hospital"](around:${radiusM},${lat},${lon});
  way["amenity"="hospital"](around:${radiusM},${lat},${lon});
  relation["amenity"="hospital"](around:${radiusM},${lat},${lon});
  node["healthcare"="hospital"](around:${radiusM},${lat},${lon});
  way["healthcare"="hospital"](around:${radiusM},${lat},${lon});
  node["amenity"="police"](around:${radiusM},${lat},${lon});
  way["amenity"="police"](around:${radiusM},${lat},${lon});
  node["amenity"="police_station"](around:${radiusM},${lat},${lon});
  way["amenity"="police_station"](around:${radiusM},${lat},${lon});
  node["emergency"="ambulance_station"](around:${radiusM},${lat},${lon});
  way["emergency"="ambulance_station"](around:${radiusM},${lat},${lon});
  node["healthcare"="ambulance_station"](around:${radiusM},${lat},${lon});
  way["healthcare"="ambulance_station"](around:${radiusM},${lat},${lon});
  node["amenity"="clinic"]["emergency"="yes"](around:${radiusM},${lat},${lon});
  way["amenity"="clinic"]["emergency"="yes"](around:${radiusM},${lat},${lon});
);
out center ${MAX_PER_TYPE * 4};
`.trim();
}

function classifyResource(
  tags: Record<string, string> | undefined,
): EmergencyResourceType | null {
  if (!tags) {
    return null;
  }
  if (tags.amenity === "hospital" || tags.healthcare === "hospital") {
    return "hospital";
  }
  if (tags.amenity === "police" || tags.amenity === "police_station") {
    return "police";
  }
  if (
    tags.emergency === "ambulance_station" ||
    tags.healthcare === "ambulance_station" ||
    (tags.amenity === "clinic" && tags.emergency === "yes")
  ) {
    return "ambulance";
  }
  return null;
}

function logResource(level: "info" | "warn", message: string, detail?: Record<string, unknown>) {
  if (process.env.NODE_ENV === "test") {
    return;
  }
  const payload = detail ?? {};
  if (level === "info") {
    console.info(`${LOG_PREFIX} ${message}`, payload);
  } else {
    console.warn(`${LOG_PREFIX} ${message}`, payload);
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithTimeout(
  url: string,
  init: RequestInit,
  timeoutMs = FETCH_TIMEOUT_MS,
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, { ...init, signal: controller.signal, cache: "no-store" });
  } finally {
    clearTimeout(timeoutId);
  }
}

async function fetchOverpass(query: string): Promise<{
  elements: OverpassElement[];
  endpoint: string;
  attempts: number;
}> {
  let lastError: Error | null = null;
  let totalAttempts = 0;

  for (const endpoint of OVERPASS_ENDPOINTS) {
    for (let attempt = 1; attempt <= MAX_ATTEMPTS_PER_ENDPOINT; attempt += 1) {
      totalAttempts += 1;
      try {
        const response = await fetchWithTimeout(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "User-Agent": OVERPASS_USER_AGENT,
          },
          body: `data=${encodeURIComponent(query)}`,
        });

        if (response.status === 429) {
          throw new Error("Overpass rate limited (429)");
        }
        if (!response.ok) {
          throw new Error(`Overpass HTTP ${response.status}`);
        }

        const json = (await response.json()) as { elements?: OverpassElement[] };
        return {
          elements: json.elements ?? [],
          endpoint,
          attempts: totalAttempts,
        };
      } catch (error) {
        const normalized =
          error instanceof Error
            ? error.name === "AbortError"
              ? new Error("Overpass request timed out")
              : error
            : new Error("Overpass failed");
        lastError = normalized;
        logResource("warn", "Overpass attempt failed", {
          endpoint,
          attempt,
          message: normalized.message,
        });
        if (attempt < MAX_ATTEMPTS_PER_ENDPOINT) {
          await delay(RETRY_DELAY_MS * attempt);
        }
      }
    }
  }

  throw lastError ?? new Error("Unable to fetch emergency resources");
}

function mapElementsToResources(
  elements: OverpassElement[],
  userLat: number,
  userLon: number,
): NearbyResourcesResult {
  const buckets: Record<EmergencyResourceType, EmergencyResource[]> = {
    hospital: [],
    police: [],
    ambulance: [],
  };

  const seen = new Set<string>();

  for (const el of elements) {
    const type = classifyResource(el.tags);
    const coords = elementCoords(el);
    if (!type || !coords) {
      continue;
    }

    const key = `${type}-${el.id}`;
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);

    const name =
      el.tags?.name ??
      el.tags?.["name:en"] ??
      el.tags?.["name:hi"] ??
      el.tags?.["name:ta"] ??
      (type === "hospital"
        ? "Hospital"
        : type === "police"
          ? "Police Station"
          : "Ambulance Service");

    const distanceKm = haversineKm(userLat, userLon, coords.lat, coords.lon);

    buckets[type].push({
      id: key,
      type,
      name,
      address: formatAddress(el.tags),
      latitude: coords.lat,
      longitude: coords.lon,
      distanceKm: Math.round(distanceKm * 10) / 10,
      mapsUrl: buildMapsUrl(coords.lat, coords.lon),
    });
  }

  const sortByDistance = (a: EmergencyResource, b: EmergencyResource) =>
    a.distanceKm - b.distanceKm;

  return {
    hospitals: buckets.hospital.sort(sortByDistance).slice(0, MAX_PER_TYPE),
    police: buckets.police.sort(sortByDistance).slice(0, MAX_PER_TYPE),
    ambulances: buckets.ambulance.sort(sortByDistance).slice(0, MAX_PER_TYPE),
    userLatitude: userLat,
    userLongitude: userLon,
  };
}

export async function getNearbyEmergencyResources(
  latitude: number,
  longitude: number,
  radiusM = DEFAULT_RADIUS_M,
): Promise<NearbyResourcesResult> {
  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude) ||
    latitude < -90 ||
    latitude > 90 ||
    longitude < -180 ||
    longitude > 180
  ) {
    throw new Error("Invalid coordinates");
  }

  const safeRadius = Number.isFinite(radiusM) && radiusM > 0 ? radiusM : DEFAULT_RADIUS_M;
  const started = Date.now();

  try {
    const query = buildOverpassQuery(latitude, longitude, safeRadius);
    const { elements, endpoint, attempts } = await fetchOverpass(query);
    const mapped = mapElementsToResources(elements, latitude, longitude);
    const durationMs = Date.now() - started;

    logResource("info", "Resources fetched", {
      latitude,
      longitude,
      radiusM: safeRadius,
      elementCount: elements.length,
      hospitals: mapped.hospitals.length,
      police: mapped.police.length,
      ambulances: mapped.ambulances.length,
      endpoint,
      attempts,
      durationMs,
    });

    return {
      ...mapped,
      meta: { durationMs, elementCount: elements.length, endpoint, attempts },
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    const durationMs = Date.now() - started;
    logResource("warn", "Upstream failure — returning empty set", {
      latitude,
      longitude,
      radiusM: safeRadius,
      message,
      durationMs,
    });
    return {
      hospitals: [],
      police: [],
      ambulances: [],
      userLatitude: latitude,
      userLongitude: longitude,
      unavailable: true,
      meta: { durationMs, elementCount: 0, attempts: OVERPASS_ENDPOINTS.length * MAX_ATTEMPTS_PER_ENDPOINT },
    };
  }
}

export async function reverseGeocodeLabel(
  latitude: number,
  longitude: number,
): Promise<string | null> {
  try {
    const url = NOMINATIM_REVERSE.replace("{lat}", String(latitude)).replace(
      "{lon}",
      String(longitude),
    );
    const response = await fetchWithTimeout(
      url,
      {
        headers: { "User-Agent": OVERPASS_USER_AGENT },
      },
      8_000,
    );
    if (!response.ok) {
      return null;
    }
    const data = (await response.json()) as { display_name?: string };
    return data.display_name ?? null;
  } catch {
    return null;
  }
}

export function getNearestByType(
  result: NearbyResourcesResult,
  type: EmergencyResourceType,
): EmergencyResource | null {
  const list =
    type === "hospital"
      ? result.hospitals
      : type === "police"
        ? result.police
        : result.ambulances;
  return list[0] ?? null;
}
