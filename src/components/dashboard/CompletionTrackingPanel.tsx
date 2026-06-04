import type { CompletionBreakdown } from "@/lib/dashboard/calculate-completion";
import { DashboardCard } from "./DashboardCard";

type CompletionTrackingPanelProps = {
  completion: CompletionBreakdown;
};

type CompletionRowProps = {
  label: string;
  value: number;
};

function CompletionRow({ label, value }: CompletionRowProps) {
  const percent = Math.max(0, Math.min(100, value));

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="font-medium text-foreground">{label}</span>
        <span className="shrink-0 font-semibold text-foreground">{percent}%</span>
      </div>
      <div
        className="h-2.5 w-full overflow-hidden rounded-full bg-muted/20"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${label} ${percent} percent complete`}
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand to-emerald-500 transition-[width] duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

export function CompletionTrackingPanel({ completion }: CompletionTrackingPanelProps) {
  return (
    <DashboardCard className="h-full">
      <h2 className="text-lg font-semibold text-foreground">Completion Tracking</h2>
      <p className="mt-1 text-sm text-muted">
        Track progress across profile, medical, contacts, and QR setup.
      </p>

      <div className="mt-5 space-y-5">
        <CompletionRow label="Profile completion" value={completion.profile} />
        <CompletionRow label="Medical profile" value={completion.medical} />
        <CompletionRow label="Emergency contacts" value={completion.contacts} />
        <CompletionRow label="QR setup" value={completion.qr} />
      </div>
    </DashboardCard>
  );
}
