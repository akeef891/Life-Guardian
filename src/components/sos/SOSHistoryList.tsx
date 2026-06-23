"use client";

import dynamic from "next/dynamic";
import { useCallback, useState } from "react";
import { LocalDateTime } from "@/components/datetime/LocalDateTime";
import { LocationQualityBadge } from "@/components/geolocation/LocationQualityBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { SOS_ESCALATION_STATUS } from "@/types/emergency-response";

const LocationPlaceDetails = dynamic(
  () =>
    import("@/components/geolocation/LocationPlaceDetails").then(
      (mod) => mod.LocationPlaceDetails,
    ),
  {
    loading: () => (
      <p className="rounded-lg border border-border bg-surface p-3 text-xs text-muted">
        Loading place details…
      </p>
    ),
  },
);

const SOSAlertActions = dynamic(
  () => import("@/components/sos/SOSAlertActions").then((mod) => mod.SOSAlertActions),
  { loading: () => null },
);

type SOSHistoryItem = {
  id: string;
  status: string;
  escalationStatus: string;
  message: string | null;
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  locationAccuracy: number | null;
  locationCapturedAt: Date | string | null;
  mapsUrl: string | null;
  deliveredCount: number;
  deliveryStatus: string;
  createdAt: Date | string;
};

type SOSHistoryListProps = {
  alerts: SOSHistoryItem[];
};

export function SOSHistoryList({ alerts: initialAlerts }: SOSHistoryListProps) {
  const [alerts, setAlerts] = useState(initialAlerts);

  const handleDeleted = useCallback((alertId: string) => {
    setAlerts((current) => current.filter((alert) => alert.id !== alertId));
  }, []);

  return (
    <section className="mt-6 min-w-0 overflow-hidden rounded-2xl border border-border bg-surface p-4 sm:mt-8 sm:p-6">
      <h2 className="text-lg font-semibold text-foreground sm:text-xl">SOS History</h2>
      <p className="mt-1 text-sm text-muted">
        Recent SOS events with escalation status and incident reports.
      </p>

      {alerts.length === 0 ? (
        <div className="mt-4">
          <EmptyState
            title="No SOS history"
            description="No SOS alerts have been triggered."
          />
        </div>
      ) : (
        <ul className="mt-4 space-y-3">
          {alerts.map((alert) => {
            const hasLocation = alert.latitude !== null && alert.longitude !== null;
            const mapsUrl = alert.mapsUrl;
            const accuracy = alert.locationAccuracy ?? alert.accuracy;
            const isEscalated = alert.escalationStatus === SOS_ESCALATION_STATUS.ESCALATED;

            return (
              <li
                key={alert.id}
                className="min-w-0 rounded-lg border border-border bg-background p-3 sm:p-4"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
                  <span className="w-fit rounded-full bg-sos/10 px-2 py-0.5 text-xs font-semibold text-sos">
                    {alert.status}
                  </span>
                  {isEscalated ? (
                    <span className="w-fit rounded-full border border-amber-300 bg-amber-50 px-2 py-0.5 text-xs font-bold uppercase text-amber-900">
                      Escalated
                    </span>
                  ) : null}
                  <span className="w-fit rounded-full border border-border px-2 py-0.5 text-xs font-medium text-muted">
                    {alert.deliveryStatus}
                  </span>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted">
                    <LocalDateTime value={alert.createdAt} mode="date" />
                    <span aria-hidden>-</span>
                    <LocalDateTime value={alert.createdAt} mode="time" />
                  </div>
                </div>

                <p className="mt-2 text-xs text-muted">
                  {alert.deliveredCount} contact{alert.deliveredCount === 1 ? "" : "s"} notified
                </p>

                {hasLocation ? (
                  <div className="mt-3 space-y-2">
                    <LocationQualityBadge accuracyM={accuracy} />
                    <LocationPlaceDetails
                      latitude={alert.latitude!}
                      longitude={alert.longitude!}
                      className="rounded-lg border border-border bg-surface p-3"
                    />
                    {alert.locationCapturedAt ? (
                      <p className="text-xs text-muted">
                        Location captured:{" "}
                        <LocalDateTime value={alert.locationCapturedAt} mode="datetime" />
                      </p>
                    ) : null}
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-muted">No location recorded for this alert.</p>
                )}

                {alert.message ? (
                  <p className="mt-2 break-words text-sm text-foreground">{alert.message}</p>
                ) : null}

                <div className="mt-3">
                  <SOSAlertActions
                    alertId={alert.id}
                    mapsUrl={mapsUrl}
                    layout="stacked"
                    onDeleted={handleDeleted}
                    className="sm:!flex-row sm:!flex-wrap sm:!items-center"
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
