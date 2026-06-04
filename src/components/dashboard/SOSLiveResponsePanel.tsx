import type { LiveSosResponseState } from "@/lib/services/sos-response.service";
import { CONTACT_RESPONSE_STATUS, SOS_ESCALATION_STATUS } from "@/types/emergency-response";
import { DashboardCard } from "./DashboardCard";
import { formatRelativeTime } from "@/lib/dashboard/format-relative-time";

type Props = {
  liveState: LiveSosResponseState | null;
};

function statusBadgeClass(status: string): string {
  switch (status) {
    case CONTACT_RESPONSE_STATUS.RESPONDING:
      return "border-brand/30 bg-brand/10 text-brand";
    case CONTACT_RESPONSE_STATUS.SAFE:
      return "border-emerald-200 bg-emerald-50 text-emerald-800";
    case CONTACT_RESPONSE_STATUS.UNAVAILABLE:
      return "border-amber-200 bg-amber-50 text-amber-900";
    default:
      return "border-border bg-background text-muted";
  }
}

export function SOSLiveResponsePanel({ liveState }: Props) {
  if (!liveState) {
    return (
      <DashboardCard>
        <h2 className="text-lg font-semibold text-foreground">Live SOS Response</h2>
        <p className="mt-2 text-sm text-muted">
          No active SOS alert. When you trigger SOS, contact responses appear here in real time.
        </p>
      </DashboardCard>
    );
  }

  const isEscalated = liveState.escalationStatus === SOS_ESCALATION_STATUS.ESCALATED;
  const answered = liveState.responses.filter(
    (r) => r.status !== CONTACT_RESPONSE_STATUS.PENDING,
  ).length;

  return (
    <DashboardCard className={isEscalated ? "border-amber-300 bg-amber-50/30" : undefined}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold text-foreground">Live SOS Response</h2>
          <p className="mt-1 text-sm text-muted">
            Started {formatRelativeTime(liveState.createdAt)} — {answered} of{" "}
            {liveState.responses.length} responded
          </p>
        </div>
        {isEscalated ? (
          <span className="inline-flex shrink-0 items-center rounded-full border border-amber-300 bg-amber-100 px-3 py-1 text-xs font-bold uppercase text-amber-900">
            Escalated
          </span>
        ) : (
          <span className="inline-flex shrink-0 items-center rounded-full border border-brand/20 bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">
            Active
          </span>
        )}
      </div>

      {liveState.responses.length === 0 ? (
        <p className="mt-4 text-sm text-muted">No contacts were notified for this alert.</p>
      ) : (
        <ul className="mt-4 space-y-2">
          {liveState.responses.map((response) => (
            <li
              key={response.id}
              className="flex flex-col gap-2 rounded-xl border border-border bg-background p-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground">{response.contactName}</p>
                {response.respondedAt ? (
                  <p className="text-xs text-muted">
                    Updated {formatRelativeTime(response.respondedAt)}
                  </p>
                ) : null}
              </div>
              <span
                className={[
                  "inline-flex w-fit shrink-0 items-center rounded-full border px-2.5 py-1 text-xs font-semibold",
                  statusBadgeClass(response.status),
                ].join(" ")}
              >
                {response.status}
              </span>
            </li>
          ))}
        </ul>
      )}
    </DashboardCard>
  );
}
