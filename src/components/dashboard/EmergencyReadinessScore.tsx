import type { EmergencyReadinessResult } from "@/lib/dashboard/calculate-emergency-readiness";
import { DashboardCard } from "./DashboardCard";
import { CircularProgress, ReadinessStatusBadge } from "./ReadinessProgress";

type Props = Pick<EmergencyReadinessResult, "score" | "status" | "statusLabel" | "factors">;

function FactorRow({
  label,
  points,
  maxPoints,
  achieved,
}: {
  label: string;
  points: number;
  maxPoints: number;
  achieved: boolean;
}) {
  return (
    <li className="flex items-start gap-2">
      <span
        className={[
          "mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold",
          achieved
            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
            : "border-border bg-background text-muted",
        ].join(" ")}
        aria-hidden
      >
        {achieved ? "✓" : "·"}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted">
          {points}/{maxPoints} pts
        </p>
      </div>
    </li>
  );
}

export function EmergencyReadinessScoreCard({ score, status, statusLabel, factors }: Props) {
  const percent = Math.max(0, Math.min(100, score));

  return (
    <DashboardCard className="h-full">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            Emergency Readiness Score
          </p>
          <p className="mt-2 text-sm text-muted">Out of 100 based on your full emergency setup.</p>
          <div className="mt-3">
            <ReadinessStatusBadge status={status} label={statusLabel} />
          </div>
        </div>
        <CircularProgress value={percent} />
      </div>

      <div className="mt-5">
        <div
          className="h-3 w-full overflow-hidden rounded-full bg-muted/20"
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Emergency readiness ${percent} percent`}
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand via-emerald-500 to-emerald-600 transition-[width] duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>
        <p className="mt-2 text-center text-sm font-semibold text-foreground">
          {percent}
          <span className="font-normal text-muted"> / 100</span>
        </p>
      </div>

      <div className="mt-5">
        <p className="text-sm font-semibold text-foreground">Score factors</p>
        <ul className="mt-3 space-y-3">
          {factors.map((factor) => (
            <FactorRow
              key={factor.key}
              label={factor.label}
              points={factor.points}
              maxPoints={factor.maxPoints}
              achieved={factor.achieved}
            />
          ))}
        </ul>
      </div>
    </DashboardCard>
  );
}
