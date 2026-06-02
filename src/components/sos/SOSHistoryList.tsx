import {
  buildGoogleMapsUrl,
  formatAccuracyLabel,
} from "@/lib/geolocation/get-accurate-position";
import { formatCoordDisplay } from "@/lib/geolocation/format-coords";

type SOSHistoryItem = {
  id: string;
  status: string;
  message: string | null;
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
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

export function SOSHistoryList({ alerts }: SOSHistoryListProps) {
  return (
    <section className="mt-6 rounded-2xl border border-border bg-surface p-4 sm:mt-8 sm:p-6">
      <h2 className="text-lg font-semibold text-foreground sm:text-xl">SOS History</h2>
      <p className="mt-1 text-sm text-muted">Recent SOS events from your account.</p>

      {alerts.length === 0 ? (
        <p className="mt-4 rounded-lg border border-dashed border-border bg-background px-4 py-3 text-sm text-muted">
          No SOS events yet.
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {alerts.map((alert) => {
            const hasLocation = alert.latitude !== null && alert.longitude !== null;
            const mapsUrl =
              hasLocation && alert.latitude != null && alert.longitude != null
                ? buildGoogleMapsUrl(alert.latitude, alert.longitude)
                : null;

            return (
              <li
                key={alert.id}
                className="rounded-lg border border-border bg-background p-3 sm:p-4"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
                  <span className="w-fit rounded-full bg-sos/10 px-2 py-0.5 text-xs font-semibold text-sos">
                    {alert.status}
                  </span>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted">
                    <span>{formatDate(alert.createdAt)}</span>
                    <span aria-hidden>•</span>
                    <span>{formatTime(alert.createdAt)}</span>
                  </div>
                </div>

                {hasLocation ? (
                  <div className="mt-3 space-y-2">
                    <div className="grid gap-1 text-sm text-muted sm:grid-cols-2">
                      <p>
                        <span className="font-medium text-foreground">Lat:</span>{" "}
                        {formatCoordDisplay(alert.latitude)}
                      </p>
                      <p>
                        <span className="font-medium text-foreground">Lng:</span>{" "}
                        {formatCoordDisplay(alert.longitude)}
                      </p>
                    </div>
                    <p className="text-xs text-muted">{formatAccuracyLabel(alert.accuracy)}</p>
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
                  <p className="mt-2 text-sm text-foreground">{alert.message}</p>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
