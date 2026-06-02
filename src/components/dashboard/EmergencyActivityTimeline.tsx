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

function kindBadge(eventKind: EmergencyTimelineEvent["kind"]) {
  switch (eventKind) {
    case "profile_updated":
      return { label: "P", className: "bg-brand/10 text-brand border-brand/20" };
    case "contact_added":
      return { label: "C+", className: "bg-emerald-10 text-emerald-800 border-emerald-200" };
    case "contact_updated":
      return { label: "C", className: "bg-amber-10 text-amber-800 border-amber-200" };
    case "qr_generated":
      return { label: "QR", className: "bg-sos/10 text-sos border-sos/20" };
    case "sos_triggered":
      return { label: "SOS", className: "bg-red-50 text-red-700 border-red-200" };
  }
}

export function EmergencyActivityTimeline({ events }: Props) {
  return (
    <DashboardCard className="mt-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Emergency Activity Timeline</h2>
          <p className="mt-1 text-sm text-muted">
            The newest changes in your readiness setup. Latest events appear first.
          </p>
        </div>
      </div>

      {events.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-border bg-background p-5">
          <p className="text-sm font-medium text-foreground">No activity yet</p>
          <p className="mt-1 text-sm text-muted">
            Update your emergency profile, add contacts, generate a QR card, or trigger an SOS
            to start building your timeline.
          </p>
        </div>
      ) : (
        <ul className="mt-6 space-y-4">
          {events.map((event) => {
            const badge = kindBadge(event.kind);
            return (
              <li key={event.id} className="flex items-start gap-3">
                <div
                  className={[
                    "mt-0.5 inline-flex items-center justify-center rounded-full border px-2 py-1 text-[11px] font-bold uppercase",
                    badge.className,
                  ].join(" ")}
                >
                  {badge.label}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-foreground">{event.title}</p>
                    <span className="text-muted">-</span>
                    <time className="text-xs text-muted">{formatTime(event.at)}</time>
                  </div>
                  {event.description ? (
                    <p className="mt-1 text-sm text-muted">{event.description}</p>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </DashboardCard>
  );
}

