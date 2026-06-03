import type { EmergencyTimelineEvent } from "@/lib/dashboard/dashboard-timeline";
import { DashboardCard } from "./DashboardCard";

type Props = {
  events: EmergencyTimelineEvent[];
};

function formatTime(at: Date) {
  return at.toLocaleString([], {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function kindStyles(eventKind: EmergencyTimelineEvent["kind"]) {
  switch (eventKind) {
    case "profile_updated":
      return {
        dot: "bg-brand border-brand/30",
        badge: "bg-brand/10 text-brand border-brand/20",
        label: "Profile",
      };
    case "contact_added":
      return {
        dot: "bg-emerald-600 border-emerald-200",
        badge: "bg-emerald-50 text-emerald-800 border-emerald-200",
        label: "Contact",
      };
    case "qr_generated":
      return {
        dot: "bg-sos border-sos/30",
        badge: "bg-sos/10 text-sos border-sos/20",
        label: "QR",
      };
    case "sos_triggered":
      return {
        dot: "bg-red-600 border-red-200",
        badge: "bg-red-50 text-red-700 border-red-200",
        label: "SOS",
      };
  }
}

export function EmergencyActivityTimeline({ events }: Props) {
  return (
    <DashboardCard className="mt-6 overflow-hidden">
      <div className="min-w-0">
        <h2 className="text-lg font-semibold text-foreground sm:text-xl">
          Emergency Activity Timeline
        </h2>
        <p className="mt-1 text-sm text-muted">
          Profile updates, contacts, QR, and SOS events — newest first.
        </p>
      </div>

      {events.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-border bg-background p-5">
          <p className="text-sm font-medium text-foreground">No activity yet</p>
          <p className="mt-1 text-sm text-muted">
            Update your profile, add contacts, generate a QR card, or trigger an SOS to build
            your timeline.
          </p>
        </div>
      ) : (
        <ol className="relative mt-6 space-y-0 border-l border-border pl-4 sm:pl-6">
          {events.map((event, index) => {
            const styles = kindStyles(event.kind);
            return (
              <li
                key={event.id}
                className={[
                  "relative min-w-0 pb-6 last:pb-0",
                  index === 0 ? "pt-0" : "",
                ].join(" ")}
              >
                <span
                  className={[
                    "absolute -left-[calc(0.5rem+5px)] top-1.5 h-2.5 w-2.5 rounded-full border-2 sm:-left-[calc(0.75rem+5px)]",
                    styles.dot,
                  ].join(" ")}
                  aria-hidden
                />
                <div className="min-w-0 rounded-xl border border-border bg-background p-3 sm:p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                    <div className="flex min-w-0 flex-wrap items-center gap-2">
                      <span
                        className={[
                          "inline-flex shrink-0 items-center rounded-full border px-2 py-0.5 text-[11px] font-bold uppercase",
                          styles.badge,
                        ].join(" ")}
                      >
                        {styles.label}
                      </span>
                      <p className="text-sm font-semibold text-foreground">{event.title}</p>
                    </div>
                    <time
                      className="shrink-0 text-xs text-muted sm:text-right"
                      dateTime={event.at.toISOString()}
                    >
                      {formatTime(event.at)}
                    </time>
                  </div>
                  {event.description ? (
                    <p className="mt-2 break-words text-sm text-muted">{event.description}</p>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </DashboardCard>
  );
}
