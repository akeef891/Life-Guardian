"use client";

import { useCallback, useEffect, useState } from "react";
import { logActivityEvent } from "@/app/(app)/activity/actions";
import { ResourceCard } from "@/components/resources/ResourceCard";
import { EmergencyMap } from "@/components/resources/EmergencyMap";
import { EmptyState } from "@/components/ui/EmptyState";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { useLocale } from "@/components/i18n/LocaleProvider";
import {
  fetchNearbyResourcesClient,
  requestUserCoordinates,
  type NearbyResourcesDiagnostics,
} from "@/lib/resources/client-fetch-nearby";
import type { NearbyResourcesResult } from "@/lib/services/emergency-resources.service";
import { ACTIVITY_EVENT_KIND } from "@/types/activity-log";

export function ResourcesExplorer() {
  const { dictionary: t } = useLocale();
  const [data, setData] = useState<NearbyResourcesResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [unavailable, setUnavailable] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loggedOpen, setLoggedOpen] = useState(false);
  const [diagnostics, setDiagnostics] = useState<NearbyResourcesDiagnostics | null>(null);
  const [autoLoaded, setAutoLoaded] = useState(false);

  const fetchResources = useCallback(
    async (lat: number, lng: number) => {
      setLoading(true);
      setError(null);
      setUnavailable(false);

      const result = await fetchNearbyResourcesClient(lat, lng);
      setDiagnostics(result.diagnostics);

      if (result.error && !result.data) {
        setError(t.resources.loadError);
        setData(null);
        setUnavailable(result.unavailable);
      } else if (result.data) {
        setData(result.data);
        setUnavailable(result.unavailable);
      }

      setLoading(false);
    },
    [t.resources.loadError],
  );

  const useMyLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setError(t.resources.locationError);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const position = await requestUserCoordinates();
      await fetchResources(position.coords.latitude, position.coords.longitude);
    } catch {
      setError(t.resources.locationError);
      setLoading(false);
    }
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

  useEffect(() => {
    if (!autoLoaded) {
      setAutoLoaded(true);
      void useMyLocation();
    }
  }, [autoLoaded, useMyLocation]);

  const hasAny =
    data &&
    (data.hospitals.length > 0 || data.police.length > 0 || data.ambulances.length > 0);

  const showNoResults = !loading && data && !unavailable && !hasAny && !error;

  return (
    <div className="min-w-0 space-y-6 overflow-x-hidden">
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => void useMyLocation()}
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

      {process.env.NODE_ENV !== "production" && diagnostics ? (
        <p className="rounded-lg border border-border bg-surface px-3 py-2 font-mono text-xs text-muted">
          diag: lat={diagnostics.lat} lng={diagnostics.lng} http={diagnostics.httpStatus} h=
          {diagnostics.hospitalCount} p={diagnostics.policeCount} a={diagnostics.ambulanceCount}{" "}
          unavailable={String(diagnostics.unavailable)} {diagnostics.durationMs}ms
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

      {showNoResults ? (
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
