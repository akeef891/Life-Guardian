"use client";

import { useCallback, useEffect, useState } from "react";
import { logActivityEvent } from "@/app/(app)/activity/actions";
import { ResourceCard } from "@/components/resources/ResourceCard";
import { EmergencyMap } from "@/components/resources/EmergencyMap";
import { EmptyState } from "@/components/ui/EmptyState";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { parseNearbyResourcesApiResponse } from "@/lib/services/emergency-resources-api";
import type { NearbyResourcesResult } from "@/lib/services/emergency-resources.service";
import { ACTIVITY_EVENT_KIND } from "@/types/activity-log";

export function ResourcesExplorer() {
  const { dictionary: t } = useLocale();
  const [data, setData] = useState<NearbyResourcesResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [unavailable, setUnavailable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loggedOpen, setLoggedOpen] = useState(false);

  const fetchResources = useCallback(async (lat: number, lng: number) => {
    setLoading(true);
    setError(null);
    setUnavailable(false);

    try {
      const response = await fetch(`/api/resources/nearby?lat=${lat}&lng=${lng}`);
      const json: unknown = await response.json();
      const parsed = parseNearbyResourcesApiResponse(json);

      if (!parsed) {
        setError(t.resources.loadError);
        setData(null);
        return;
      }

      setData(parsed);
      setUnavailable(Boolean(parsed.unavailable));
    } catch {
      setError(t.resources.loadError);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [t.resources.loadError]);

  const useMyLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError(t.resources.locationError);
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        void fetchResources(position.coords.latitude, position.coords.longitude);
      },
      () => {
        setError(t.resources.locationError);
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
    );
  }, [fetchResources, t.resources.locationError]);

  useEffect(() => {
    if (!loggedOpen) {
      setLoggedOpen(true);
      void logActivityEvent(
        ACTIVITY_EVENT_KIND.RESOURCE_OPENED,
        "Emergency Resource Center opened",
        "User opened the resource center",
      );
    }
  }, [loggedOpen]);

  const hasAny =
    data &&
    (data.hospitals.length > 0 || data.police.length > 0 || data.ambulances.length > 0);

  return (
    <div className="min-w-0 space-y-6 overflow-x-hidden">
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={useMyLocation}
          disabled={loading}
          className="inline-flex min-h-11 min-w-[11rem] items-center justify-center rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-brand-dark focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/30 disabled:opacity-60"
        >
          {loading ? t.common.loading : t.resources.useLocation}
        </button>
      </div>

      {error ? (
        <p
          className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      {unavailable && !error ? (
        <p
          className="rounded-lg border border-amber-200/80 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-100"
          role="status"
        >
          {t.resources.unavailable}
        </p>
      ) : null}

      {loading ? (
        <div className="space-y-3" aria-busy="true" aria-label={t.common.loading}>
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : (
        <EmergencyMap data={data} />
      )}

      {!loading && data && !hasAny ? (
        <EmptyState title={t.resources.noResults} description={t.resources.description} />
      ) : null}

      {data && data.hospitals.length > 0 ? (
        <section aria-labelledby="hospitals-heading" className="min-w-0">
          <h2 id="hospitals-heading" className="text-lg font-semibold text-foreground">
            {t.resources.hospitals}
          </h2>
          <ul className="mt-3 space-y-3">
            {data.hospitals.map((r) => (
              <li key={r.id} className="min-w-0">
                <ResourceCard
                  resource={r}
                  openMapsLabel={t.common.openMaps}
                  distanceLabel={t.common.distance}
                />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {data && data.police.length > 0 ? (
        <section aria-labelledby="police-heading" className="min-w-0">
          <h2 id="police-heading" className="text-lg font-semibold text-foreground">
            {t.resources.police}
          </h2>
          <ul className="mt-3 space-y-3">
            {data.police.map((r) => (
              <li key={r.id} className="min-w-0">
                <ResourceCard
                  resource={r}
                  openMapsLabel={t.common.openMaps}
                  distanceLabel={t.common.distance}
                />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {data && data.ambulances.length > 0 ? (
        <section aria-labelledby="ambulance-heading" className="min-w-0">
          <h2 id="ambulance-heading" className="text-lg font-semibold text-foreground">
            {t.resources.ambulances}
          </h2>
          <ul className="mt-3 space-y-3">
            {data.ambulances.map((r) => (
              <li key={r.id} className="min-w-0">
                <ResourceCard
                  resource={r}
                  openMapsLabel={t.common.openMaps}
                  distanceLabel={t.common.distance}
                />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
