import type { EmergencyAnalytics } from "@/lib/services/emergency-analytics.service";
import { DashboardCard } from "./DashboardCard";

type Props = {
  analytics: EmergencyAnalytics;
};

type AnalyticsCardProps = {
  label: string;
  value: string;
  hint?: string;
  trend?: EmergencyAnalytics["readinessTrendDirection"];
};

function AnalyticsCard({ label, value, hint, trend }: AnalyticsCardProps) {
  const trendLabel =
    trend === "up" ? "↑" : trend === "down" ? "↓" : "→";

  return (
    <DashboardCard className="p-4 sm:p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-2 text-2xl font-bold text-foreground">{value}</p>
      {hint ? (
        <p className="mt-2 text-sm text-muted">
          {trend ? <span className="mr-1 font-semibold">{trendLabel}</span> : null}
          {hint}
        </p>
      ) : null}
    </DashboardCard>
  );
}

export function EmergencyAnalyticsCards({ analytics }: Props) {
  return (
    <section className="min-w-0">
      <h2 className="text-lg font-semibold text-foreground sm:text-xl">Emergency Analytics</h2>
      <p className="mt-1 text-sm text-muted">Response performance and readiness insights.</p>

      <div className="mt-4 grid min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <AnalyticsCard label="Total SOS" value={String(analytics.totalSos)} />
        <AnalyticsCard
          label="Responses Received"
          value={String(analytics.responsesReceived)}
        />
        <AnalyticsCard label="Escalations" value={String(analytics.escalations)} />
        <AnalyticsCard
          label="Avg Response Time"
          value={
            analytics.averageResponseTimeMinutes != null
              ? `${analytics.averageResponseTimeMinutes} min`
              : "—"
          }
          hint="From alert to first contact response"
        />
        <AnalyticsCard
          label="Readiness Trend"
          value={analytics.readinessTrendDirection === "up" ? "Improving" : analytics.readinessTrendDirection === "down" ? "Attention" : "Steady"}
          hint={analytics.readinessTrendLabel}
          trend={analytics.readinessTrendDirection}
        />
      </div>
    </section>
  );
}
