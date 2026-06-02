import type { EmergencyReadinessItem, EmergencyReadinessScore } from "@/lib/dashboard/calculate-emergency-readiness";
import { DashboardCard } from "./DashboardCard";

type Props = EmergencyReadinessScore;

function ChecklistRow({ item }: { item: EmergencyReadinessItem }) {
  return (
    <li className="flex items-start gap-2">
      <span
        className={[
          "mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full border text-xs font-bold",
          item.achieved
            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
            : "border-border bg-background text-muted",
        ].join(" ")}
        aria-hidden
      >
        {item.achieved ? "ON" : "OFF"}
      </span>
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground">{item.label}</p>
        <p className="text-xs text-muted">{item.achieved ? `${item.points} pts` : "Not yet"}</p>
      </div>
    </li>
  );
}

export function EmergencyReadinessScoreCard({ score, items }: Props) {
  const percent = Math.max(0, Math.min(100, score));

  return (
    <DashboardCard className="h-full">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            Emergency Readiness Score
          </p>
          <p className="mt-2 text-4xl font-bold tracking-tight text-foreground">
            {percent}
            <span className="text-base font-semibold text-muted">/100</span>
          </p>
          <p className="mt-1 text-sm text-muted">
            A quick snapshot of how ready your emergency setup is.
          </p>
        </div>
        <div className="rounded-xl bg-brand/10 px-3 py-2 text-sm font-semibold text-brand">
          {percent >= 75 ? "Strong" : percent >= 40 ? "Building" : "Getting started"}
        </div>
      </div>

      <div className="mt-5">
        <div className="h-3 w-full overflow-hidden rounded-full bg-muted/20" aria-hidden>
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand to-red-500"
            style={{ width: `${percent}%` }}
          />
        </div>
        <div className="mt-4">
          <p className="text-sm font-semibold text-foreground">What improves your score</p>
          <ul className="mt-3 space-y-3">
            {items.map((item) => (
              <ChecklistRow key={item.key} item={item} />
            ))}
          </ul>
        </div>
      </div>
    </DashboardCard>
  );
}

