import { EmptyState } from "@/components/ui/EmptyState";
import { formatAccuracyLabel } from "@/lib/geolocation/get-accurate-position";
import { formatCoordDisplay } from "@/lib/geolocation/format-coords";

type SOSHistoryItem = {
  id: string;
  status: string;
  message: string | null;
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  locationAccuracy: number | null;
  locationCapturedAt: Date | null;
  mapsUrl: string | null;
  deliveredCount: number;
  deliveryStatus: string;
  createdAt: Date;
};

type SOSHistoryListProps = {
  alerts: SOSHistoryItem[];
};

function formatDate(value: Date) {
  return value.toLocaleDateString();
}

function formatTime(value: Date) {
  return value.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatCapturedAt(value: Date | null) {
  if (!value) {
    return null;
  }
  return value.toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function SOSHistoryList({ alerts }: SOSHistoryListProps) {
  return (
    <section className="mt-6 min-w-0 overflow-hidden rounded-2xl border border-border bg-surface p-4 sm:mt-8 sm:p-6">
      <h2 className="text-lg font-semibold text-foreground sm:text-xl">SOS History</h2>
      <p className="mt-1 text-sm text-muted">Recent SOS events with GPS accuracy and delivery status.</p>

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
            const capturedLabel = formatCapturedAt(alert.locationCapturedAt);

            return (
              <li
                key={alert.id}
                className="min-w-0 rounded-lg border border-border bg-background p-3 sm:p-4"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
                  <span className="w-fit rounded-full bg-sos/10 px-2 py-0.5 text-xs font-semibold text-sos">
                    {alert.status}
                  </span>
                  <span className="w-fit rounded-full border border-border px-2 py-0.5 text-xs font-medium text-muted">
                    {alert.deliveryStatus}
                  </span>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted">
                    <span>{formatDate(alert.createdAt)}</span>
                    <span aria-hidden>-</span>
                    <span>{formatTime(alert.createdAt)}</span>
                  </div>
                </div>

                <p className="mt-2 text-xs text-muted">
                  {alert.deliveredCount} contact{alert.deliveredCount === 1 ? "" : "s"} — WhatsApp/SMS
                  prepared
                </p>

                {hasLocation ? (
                  <div className="mt-3 space-y-2">
                    <div className="grid gap-1 text-sm text-muted sm:grid-cols-2">
                      <p className="min-w-0 break-all">
                        <span className="font-medium text-foreground">Lat:</span>{" "}
                        {formatCoordDisplay(alert.latitude)}
                      </p>
                      <p className="min-w-0 break-all">
                        <span className="font-medium text-foreground">Lng:</span>{" "}
                        {formatCoordDisplay(alert.longitude)}
                      </p>
                    </div>
                    <p className="text-xs font-medium text-foreground">
                      GPS: {formatAccuracyLabel(accuracy)}
                    </p>
                    {capturedLabel ? (
                      <p className="text-xs text-muted">Location captured: {capturedLabel}</p>
                    ) : null}
                    {mapsUrl ? (
                      <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex min-h-10 w-full items-center justify-center rounded-lg border border-border px-3 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-surface sm:w-auto sm:justify-start"
                      >
                        View on Google Maps
                      </a>
                    ) : null}
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-muted">No location recorded for this alert.</p>
                )}

                {alert.message ? (
                  <p className="mt-2 break-words text-sm text-foreground">{alert.message}</p>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
