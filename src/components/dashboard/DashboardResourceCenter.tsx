"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { LocalDateTime } from "@/components/datetime/LocalDateTime";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  fetchNearbyResourcesClient,
  requestUserCoordinates,
} from "@/lib/resources/client-fetch-nearby";
import { ROUTES } from "@/lib/constants/routes";
import type { EmergencyResource, NearbyResourcesResult } from "@/lib/services/emergency-resources.service";
import type { SafetyCheckInStatus } from "@/types/safety-check-in";
import type { CommunityAlertDto } from "@/types/community-alert";

type Props = {
  latestCheckInStatus: SafetyCheckInStatus | null;
  latestCheckInAt: Date | string | null;
  latestAlert: CommunityAlertDto | null;
};

function ResourceSnippet({
  label,
  resource,
  loading,
  emptyHint,
}: {
  label: string;
  resource: EmergencyResource | null;
  loading: boolean;
  emptyHint: string;
}) {
  if (loading) {
    return (
      <div className="min-w-0 rounded-xl border border-border bg-background p-3">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="mt-3 h-4 w-3/4" />
        <Skeleton className="mt-2 h-3 w-16" />
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="min-w-0 rounded-xl border border-dashed border-border bg-background p-3">
        <p className="text-xs font-semibold uppercase text-muted">{label}</p>
        <p className="mt-1 break-words text-sm text-muted">{emptyHint}</p>
      </div>
    );
  }

  return (
    <div className="min-w-0 rounded-xl border border-border bg-background p-3">
      <p className="text-xs font-semibold uppercase text-muted">{label}</p>
      <p className="mt-1 break-words text-sm font-semibold text-foreground">{resource.name}</p>
      <p className="text-xs text-muted">{resource.distanceKm} km</p>
      <a
        href={resource.mapsUrl}
        target="_blank"
        rel="noreferrer"
        className="mt-2 inline-flex min-h-11 items-center text-xs font-semibold text-brand transition-colors hover:underline focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/25"
      >
        Directions
      </a>
    </div>
  );
}

export function DashboardResourceCenter({
  latestCheckInStatus,
  latestCheckInAt,
  latestAlert,
}: Props) {
  const { dictionary: t } = useLocale();
  const [data, setData] = useState<NearbyResourcesResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const [locationDenied, setLocationDenied] = useState(false);

  const loadNearby = useCallback(async () => {
    if (!navigator.geolocation) {
      return;
    }

    setLoading(true);
    setLocationDenied(false);

    try {
      const position = await requestUserCoordinates({
        enableHighAccuracy: false,
        timeout: 12000,
        maximumAge: 300000,
      });
      const result = await fetchNearbyResourcesClient(
        position.coords.latitude,
        position.coords.longitude,
      );
      setData(result.data);
      setUnavailable(result.unavailable);
    } catch {
      setLocationDenied(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadNearby();
  }, [loadNearby]);

  const hospital: EmergencyResource | null = data?.hospitals[0] ?? null;
  const police: EmergencyResource | null = data?.police[0] ?? null;
  const emptyHint = unavailable
    ? t.resources.unavailable
    : locationDenied
      ? t.resources.locationError
      : t.resources.locationHint;

  return (
    <DashboardCard>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h2 className="text-lg font-semibold text-foreground">{t.dashboard.resourceCenter}</h2>
        <Link
          href={ROUTES.resources}
          className="inline-flex min-h-11 items-center text-sm font-semibold text-brand transition-colors hover:underline focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/25"
        >
          View all →
        </Link>
      </div>

      {unavailable && !loading ? (
        <p className="mt-3 rounded-lg border border-amber-200/80 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-100">
          {t.resources.unavailable}
        </p>
      ) : null}

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <ResourceSnippet
          label={t.dashboard.nearestHospital}
          resource={hospital}
          loading={loading}
          emptyHint={emptyHint}
        />
        <ResourceSnippet
          label={t.dashboard.nearestPolice}
          resource={police}
          loading={loading}
          emptyHint={emptyHint}
        />
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="min-w-0 rounded-xl border border-border bg-background p-3">
          <p className="text-xs font-semibold uppercase text-muted">{t.dashboard.safetyStatus}</p>
          <p className="mt-1 break-words text-sm font-semibold text-foreground">
            {latestCheckInStatus ?? "No check-in yet"}
          </p>
          {latestCheckInAt ? (
            <p className="mt-1 text-xs text-muted">
              <LocalDateTime value={latestCheckInAt} mode="datetime" />
            </p>
          ) : null}
          <Link
            href={ROUTES.checkIn}
            className="mt-2 inline-flex min-h-11 items-center text-xs font-semibold text-brand transition-colors hover:underline focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/25"
          >
            Check in →
          </Link>
        </div>

        <div className="min-w-0 rounded-xl border border-border bg-background p-3">
          <p className="text-xs font-semibold uppercase text-muted">
            {t.dashboard.communityAlerts}
          </p>
          {latestAlert ? (
            <>
              <p className="mt-1 break-words text-sm font-semibold text-foreground">{latestAlert.title}</p>
              <p className="mt-1 line-clamp-2 break-words text-xs text-muted">{latestAlert.description}</p>
            </>
          ) : (
            <p className="mt-1 text-sm text-muted">No alerts</p>
          )}
        </div>
      </div>
    </DashboardCard>
  );
}
