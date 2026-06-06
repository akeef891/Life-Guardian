export type ReverseGeocodePlace = {
  latitude: number;
  longitude: number;
  coordinatesLabel: string;
  nearestLocality: string | null;
  district: string | null;
  state: string | null;
  displayName: string | null;
};

type NominatimAddress = {
  suburb?: string;
  neighbourhood?: string;
  village?: string;
  town?: string;
  city?: string;
  city_district?: string;
  county?: string;
  state_district?: string;
  district?: string;
  state?: string;
};

type NominatimResponse = {
  display_name?: string;
  address?: NominatimAddress;
};

const USER_AGENT = "LifeGuardian/1.0 (emergency-app; contact@lifeguardian.app)";

function pickLocality(address: NominatimAddress | undefined): string | null {
  if (!address) {
    return null;
  }
  return (
    address.suburb ??
    address.neighbourhood ??
    address.village ??
    address.town ??
    address.city ??
    address.city_district ??
    null
  );
}

function pickDistrict(address: NominatimAddress | undefined): string | null {
  if (!address) {
    return null;
  }
  return address.district ?? address.county ?? address.state_district ?? null;
}

export function formatCoordinatesLabel(latitude: number, longitude: number): string {
  return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
}

export async function reverseGeocodePlace(
  latitude: number,
  longitude: number,
): Promise<ReverseGeocodePlace> {
  const base: ReverseGeocodePlace = {
    latitude,
    longitude,
    coordinatesLabel: formatCoordinatesLabel(latitude, longitude),
    nearestLocality: null,
    district: null,
    state: null,
    displayName: null,
  };

  try {
    const url = new URL("https://nominatim.openstreetmap.org/reverse");
    url.searchParams.set("format", "json");
    url.searchParams.set("lat", String(latitude));
    url.searchParams.set("lon", String(longitude));
    url.searchParams.set("addressdetails", "1");
    url.searchParams.set("zoom", "16");

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8_000);

    try {
      const response = await fetch(url.toString(), {
        headers: { "User-Agent": USER_AGENT },
        signal: controller.signal,
        cache: "no-store",
      });

      if (!response.ok) {
        return base;
      }

      const data = (await response.json()) as NominatimResponse;
      return {
        ...base,
        nearestLocality: pickLocality(data.address),
        district: pickDistrict(data.address),
        state: data.address?.state ?? null,
        displayName: data.display_name ?? null,
      };
    } finally {
      clearTimeout(timeoutId);
    }
  } catch {
    return base;
  }
}
