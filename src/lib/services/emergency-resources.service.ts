import { formatCoordForMaps } from "@/lib/geolocation/get-accurate-position";

export type EmergencyResourceType = "hospital" | "police" | "ambulance";

export type EmergencyResource = {
  id: string;
  type: EmergencyResourceType;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  /** Distance in meters (Haversine). */
  distanceM: number;
  /** Distance in km (legacy/display helper). */
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
  searchRadiusM: number;
};

/** Progressive search: start tight, expand only when needed. */
export const RESOURCE_SEARCH_RADII_M = [2_000, 5_000, 10_000] as const;
const MIN_TOTAL_RESULTS = 3;

function shouldExpandSearchRadius(
  mapped: Pick<NearbyResourcesResult, "hospitals" | "police" | "ambulances">,
): boolean {
  const total = countTotalResources(mapped);
  if (total < MIN_TOTAL_RESULTS) {
    return true;
  }
  // Expand if any critical category is empty (nearest-first quality)
  return mapped.hospitals.length === 0 || mapped.police.length === 0;
}
const MAX_PER_TYPE = 12;
const FETCH_TIMEOUT_MS = 18_000;
const RETRY_DELAY_MS = 600;
const MAX_ATTEMPTS_PER_ENDPOINT = 2;
const SERVER_CACHE_TTL_MS = 2 * 60 * 1000;
const LOG_PREFIX = "[emergency-resources]";

const OVERPASS_ENDPOINTS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
  "https://overpass.openstreetmap.fr/api/interpreter",
];

const OVERPASS_USER_AGENT = "LifeGuardian/1.0 (emergency-app; contact@lifeguardian.app)";

type OverpassElement = {
  type: string;
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
};

type CacheEntry = {
  expiresAt: number;
  result: NearbyResourcesResult;
};

const serverResourceCache = new Map<string, CacheEntry>();

const EARTH_RADIUS_M = 6_371_000;

function haversineMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return EARTH_RADIUS_M * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function buildMapsUrl(lat: number, lon: number): string {
  return `https://www.google.com/maps/search/?api=1&query=${formatCoordForMaps(lat)},${formatCoordForMaps(lon)}`;
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

function cacheKey(lat: number, lon: number): string {
  return `${lat.toFixed(5)},${lon.toFixed(5)}`;
}

function getServerCached(lat: number, lon: number): NearbyResourcesResult | null {
  const entry = serverResourceCache.get(cacheKey(lat, lon));
  if (!entry || entry.expiresAt <= Date.now()) {
    if (entry) {
      serverResourceCache.delete(cacheKey(lat, lon));
    }
    return null;
  }
  return entry.result;
}

function setServerCache(lat: number, lon: number, result: NearbyResourcesResult) {
  if (result.unavailable) {
    return;
  }
  serverResourceCache.set(cacheKey(lat, lon), {
    expiresAt: Date.now() + SERVER_CACHE_TTL_MS,
    result,
  });
}

function countTotalResources(result: Pick<NearbyResourcesResult, "hospitals" | "police" | "ambulances">) {
  return result.hospitals.length + result.police.length + result.ambulances.length;
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
): Pick<NearbyResourcesResult, "hospitals" | "police" | "ambulances"> {
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

    const distanceM = Math.round(haversineMeters(userLat, userLon, coords.lat, coords.lon));

    buckets[type].push({
      id: key,
      type,
      name,
      address: formatAddress(el.tags),
      latitude: coords.lat,
      longitude: coords.lon,
      distanceM,
      distanceKm: Math.round((distanceM / 1000) * 10) / 10,
      mapsUrl: buildMapsUrl(coords.lat, coords.lon),
    });
  }

  const sortByDistance = (a: EmergencyResource, b: EmergencyResource) => a.distanceM - b.distanceM;

  return {
    hospitals: buckets.hospital.sort(sortByDistance).slice(0, MAX_PER_TYPE),
    police: buckets.police.sort(sortByDistance).slice(0, MAX_PER_TYPE),
    ambulances: buckets.ambulance.sort(sortByDistance).slice(0, MAX_PER_TYPE),
  };
}

export async function getNearbyEmergencyResources(
  latitude: number,
  longitude: number,
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

  const cached = getServerCached(latitude, longitude);
  if (cached) {
    logResource("info", "Server cache hit", { latitude, longitude });
    return cached;
  }

  const started = Date.now();
  let lastMapped: Pick<NearbyResourcesResult, "hospitals" | "police" | "ambulances"> = {
    hospitals: [],
    police: [],
    ambulances: [],
  };
  let lastMeta: Partial<NearbyResourcesMeta> = {};

  try {
    for (const radiusM of RESOURCE_SEARCH_RADII_M) {
      const query = buildOverpassQuery(latitude, longitude, radiusM);
      const { elements, endpoint, attempts } = await fetchOverpass(query);
      lastMapped = mapElementsToResources(elements, latitude, longitude);
      lastMeta = {
        elementCount: elements.length,
        endpoint,
        attempts,
        searchRadiusM: radiusM,
      };

      const total = countTotalResources(lastMapped);
      logResource("info", "Radius search completed", {
        latitude,
        longitude,
        radiusM,
        total,
        hospitals: lastMapped.hospitals.length,
        police: lastMapped.police.length,
        ambulances: lastMapped.ambulances.length,
      });

      if (!shouldExpandSearchRadius(lastMapped) || radiusM === RESOURCE_SEARCH_RADII_M.at(-1)) {
        break;
      }
    }

    const durationMs = Date.now() - started;
    const result: NearbyResourcesResult = {
      ...lastMapped,
      userLatitude: latitude,
      userLongitude: longitude,
      meta: {
        durationMs,
        elementCount: lastMeta.elementCount ?? 0,
        endpoint: lastMeta.endpoint,
        attempts: lastMeta.attempts ?? 0,
        searchRadiusM: lastMeta.searchRadiusM ?? RESOURCE_SEARCH_RADII_M[0],
      },
    };

    setServerCache(latitude, longitude, result);
    return result;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    const durationMs = Date.now() - started;
    logResource("warn", "Upstream failure — returning empty set", {
      latitude,
      longitude,
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
      meta: {
        durationMs,
        elementCount: 0,
        attempts: OVERPASS_ENDPOINTS.length * MAX_ATTEMPTS_PER_ENDPOINT,
        searchRadiusM: RESOURCE_SEARCH_RADII_M[0],
      },
    };
  }
}

export { reverseGeocodePlace, formatCoordinatesLabel } from "@/lib/geolocation/reverse-geocode";

export async function reverseGeocodeLabel(
  latitude: number,
  longitude: number,
): Promise<string | null> {
  const { reverseGeocodePlace } = await import("@/lib/geolocation/reverse-geocode");
  const place = await reverseGeocodePlace(latitude, longitude);
  return place.displayName;
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
