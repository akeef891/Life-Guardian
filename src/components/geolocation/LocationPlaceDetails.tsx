"use client";

import { useEffect, useState } from "react";
import type { ReverseGeocodePlace } from "@/lib/geolocation/reverse-geocode";
import { formatCoordinatesLabel } from "@/lib/geolocation/reverse-geocode";

type LocationPlaceDetailsProps = {
  latitude: number;
  longitude: number;
  className?: string;
};

export function LocationPlaceDetails({
  latitude,
  longitude,
  className,
}: LocationPlaceDetailsProps) {
  const [place, setPlace] = useState<ReverseGeocodePlace | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const response = await fetch(
          `/api/geocode/reverse?lat=${latitude}&lng=${longitude}`,
          { cache: "no-store" },
        );
        if (!response.ok) {
          return;
        }
        const json = (await response.json()) as ReverseGeocodePlace;
        if (!cancelled) {
          setPlace(json);
        }
      } catch {
        /* display-only enrichment */
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [latitude, longitude]);

  const coords = place?.coordinatesLabel ?? formatCoordinatesLabel(latitude, longitude);

  return (
    <dl className={className}>
      <div>
        <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
          Exact GPS coordinates
        </dt>
        <dd className="mt-1 break-all font-mono text-sm text-foreground">{coords}</dd>
      </div>
      {place?.nearestLocality ? (
        <div className="mt-2">
          <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
            Nearest locality
          </dt>
          <dd className="mt-1 text-sm text-foreground">{place.nearestLocality}</dd>
        </div>
      ) : null}
      {place?.district ? (
        <div className="mt-2">
          <dt className="text-xs font-semibold uppercase tracking-wide text-muted">District</dt>
          <dd className="mt-1 text-sm text-foreground">{place.district}</dd>
        </div>
      ) : null}
      {place?.state ? (
        <div className="mt-2">
          <dt className="text-xs font-semibold uppercase tracking-wide text-muted">State</dt>
          <dd className="mt-1 text-sm text-foreground">{place.state}</dd>
        </div>
      ) : null}
    </dl>
  );
}
