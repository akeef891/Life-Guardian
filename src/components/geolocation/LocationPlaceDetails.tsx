"use client";

import { useEffect, useState } from "react";
import type { ReverseGeocodePlace } from "@/lib/geolocation/reverse-geocode";
import { formatCoordinatesLabel } from "@/lib/geolocation/reverse-geocode";
import { cn } from "@/lib/utils/cn";

type LocationPlaceDetailsProps = {
  latitude: number;
  longitude: number;
  className?: string;
  /** High-contrast palette for light success cards (SOS confirmation). */
  variant?: "default" | "success";
};

export function LocationPlaceDetails({
  latitude,
  longitude,
  className,
  variant = "default",
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
  const labelClass =
    variant === "success"
      ? "text-xs font-semibold uppercase tracking-wide text-slate-600"
      : "text-xs font-semibold uppercase tracking-wide text-muted";
  const valueClass =
    variant === "success" ? "text-sm text-slate-900" : "text-sm text-foreground";
  const coordsClass =
    variant === "success"
      ? "mt-1 break-all font-mono text-sm text-slate-900"
      : "mt-1 break-all font-mono text-sm text-foreground";

  return (
    <dl className={className}>
      <div>
        <dt className={labelClass}>Exact GPS coordinates</dt>
        <dd className={coordsClass}>{coords}</dd>
      </div>
      {place?.nearestLocality ? (
        <div className="mt-2">
          <dt className={labelClass}>Nearest locality</dt>
          <dd className={cn("mt-1", valueClass)}>{place.nearestLocality}</dd>
        </div>
      ) : null}
      {place?.district ? (
        <div className="mt-2">
          <dt className={labelClass}>District</dt>
          <dd className={cn("mt-1", valueClass)}>{place.district}</dd>
        </div>
      ) : null}
      {place?.state ? (
        <div className="mt-2">
          <dt className={labelClass}>State</dt>
          <dd className={cn("mt-1", valueClass)}>{place.state}</dd>
        </div>
      ) : null}
    </dl>
  );
}
