"use client";

import { useCallback, useEffect, useState } from "react";
import { logActivityEvent } from "@/app/(app)/activity/actions";
import { ResourceCard } from "@/components/resources/ResourceCard";
import { EmergencyMap } from "@/components/resources/EmergencyMap";
import { LocationPlaceDetails } from "@/components/geolocation/LocationPlaceDetails";
import { LocationQualityBadge } from "@/components/geolocation/LocationQualityBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { useLocale } from "@/components/i18n/LocaleProvider";
import {
  loadResourcesWithHighAccuracyGps,
  type NearbyResourcesDiagnostics,
} from "@/lib/resources/client-fetch-nearby";
import type { GeolocationSuccess } from "@/lib/geolocation/get-accurate-position";
import type { NearbyResourcesResult } from "@/lib/services/emergency-resources.service";
import { ACTIVITY_EVENT_KIND } from "@/types/activity-log";

export function ResourcesExplorer() {
  const { dictionary: t } = useLocale();
  const [data, setData] = useState<NearbyResourcesResult | null>(null);
  const [gps, setGps] = useState<GeolocationSuccess | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [unavailable, setUnavailable] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loggedOpen, setLoggedOpen] = useState(false);
  const [diagnostics, setDiagnostics] = useState<NearbyResourcesDiagnostics | null>(null);

  const loadResources = useCallback(async () => {
    setLoading(true);
    setError(null);
    setUnavailable(false);

    const result = await loadResourcesWithHighAccuracyGps();
    setDiagnostics(result.diagnostics);

    if (!result.gps) {
      if (result.error === "permission-denied" || result.error === "unsupported") {
        setError(t.resources.locationError);
      } else if (result.error) {
        setError(t.resources.gpsTimeout);
      }
      setData(null);
      setGps(null);
      setLoading(false);
      return;
    }

    setGps(result.gps);

    if (result.error && !result.data) {
      setError(t.resources.loadError);
      setData(null);
      setUnavailable(result.unavailable);
      setLoading(false);
      return;
    }

    setData(result.data);
    setUnavailable(result.unavailable);
    setLoading(false);
  }, [t.resources.loadError, t.resources.locationError, t.resources.gpsTimeout]);

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
    void loadResources();
  }, [loadResources]);

  const hasAny =
    data &&
    (data.hospitals.length > 0 || data.police.length > 0 || data.ambulances.length > 0);

  const showNoResults = !loading && data && !unavailable && !hasAny && !error;

  return (
    <div className="min-w-0 space-y-6 overflow-x-hidden">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => void loadResources()}
          disabled={loading}
          className="inline-flex min-h-11 min-w-[11rem] items-center justify-center rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-brand-dark focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/30 disabled:opacity-60"
        >
          {loading ? t.resources.acquiringGps : t.resources.refreshLocation}
        </button>
        {gps ? <LocationQualityBadge accuracyM={gps.accuracy} /> : null}
      </div>

      {loading ? (
        <p className="text-sm text-muted" role="status">
          {t.resources.acquiringGps}
        </p>
      ) : null}

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
          diag: lat={diagnostics.lat} lng={diagnostics.lng} acc={diagnostics.accuracyM}m gpsAttempts=
          {diagnostics.gpsAttempts} radius={diagnostics.searchRadiusM}m h={diagnostics.hospitalCount}{" "}
          p={diagnostics.policeCount} a={diagnostics.ambulanceCount} cache=
          {String(diagnostics.cacheHit)} {diagnostics.durationMs}ms
        </p>
      ) : null}

      {data?.meta?.searchRadiusM != null && !loading ? (
        <p className="text-xs text-muted" role="status">
          Search radius: {(data.meta.searchRadiusM / 1000).toFixed(1)} km from your GPS position
        </p>
      ) : null}

      {gps ? (
        <LocationPlaceDetails latitude={gps.latitude} longitude={gps.longitude} className="rounded-xl border border-border bg-background p-4" />
      ) : null}

      {loading ? (
        <div className="space-y-3" aria-busy="true" aria-label={t.common.loading}>
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : (
        <EmergencyMap data={data} accuracyM={gps?.accuracy} />
      )}

      {showNoResults ? (
        <EmptyState title={t.resources.noResults} description={t.resources.noResultsHint} />
      ) : null}

      {data && data.hospitals.length > 0 ? (
        <section aria-labelledby="hospitals-heading" className="min-w-0">
          <h2 id="hospitals-heading" className="text-lg font-semibold text-foreground">
            {t.resources.hospitals}
          </h2>
          <ul className="mt-3 space-y-3">
            {data.hospitals.map((r) => (
              <li key={r.id} className="min-w-0">
                <ResourceCard resource={r} openMapsLabel={t.common.openMaps} />
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
                <ResourceCard resource={r} openMapsLabel={t.common.openMaps} />
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
                <ResourceCard resource={r} openMapsLabel={t.common.openMaps} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
