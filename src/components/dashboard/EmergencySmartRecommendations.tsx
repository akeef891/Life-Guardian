import Link from "next/link";
import type { DashboardRecommendation } from "@/lib/dashboard/generate-recommendations";
import { DashboardCard } from "./DashboardCard";

type EmergencySmartRecommendationsProps = {
  recommendations: DashboardRecommendation[];
};

export function EmergencySmartRecommendations({
  recommendations,
}: EmergencySmartRecommendationsProps) {
  return (
    <DashboardCard className="h-full">
      <h2 className="text-lg font-semibold text-foreground">Smart Recommendations</h2>
      <p className="mt-1 text-sm text-muted">
        Personalized next steps to improve your emergency readiness.
      </p>

      {recommendations.length === 0 ? (
        <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-sm font-semibold text-emerald-900">You&apos;re all set</p>
          <p className="mt-1 text-sm text-emerald-800">
            All recommended setup steps are complete. Keep your info up to date.
          </p>
        </div>
      ) : (
        <ul className="mt-5 space-y-3">
          {recommendations.map((item) => (
            <li key={item.id}>
              <Link
                href={item.href}
                className="group flex min-h-11 items-start gap-3 rounded-xl border border-border bg-background p-4 transition-colors hover:border-brand/30 hover:bg-brand/5 focus:outline-none focus:ring-4 focus:ring-brand/25"
              >
                <span
                  className={[
                    "mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                    item.priority === "high"
                      ? "bg-sos/10 text-sos"
                      : "bg-brand/10 text-brand",
                  ].join(" ")}
                  aria-hidden
                >
                  !
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-foreground group-hover:text-brand">
                    {item.title}
                  </span>
                  <span className="mt-1 block text-xs text-muted">{item.description}</span>
                </span>
                <span className="shrink-0 text-sm font-semibold text-brand" aria-hidden>
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </DashboardCard>
  );
}
