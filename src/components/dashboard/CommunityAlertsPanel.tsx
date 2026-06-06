"use client";

import { useEffect, useState } from "react";
import { LocalDateTime } from "@/components/datetime/LocalDateTime";
import { logActivityEvent } from "@/app/(app)/activity/actions";
import type { CommunityAlertDto } from "@/types/community-alert";
import { ACTIVITY_EVENT_KIND } from "@/types/activity-log";
import { DashboardCard } from "./DashboardCard";
import { useLocale } from "@/components/i18n/LocaleProvider";

type Props = {
  alerts: CommunityAlertDto[];
};

function severityClasses(severity: CommunityAlertDto["severity"]): string {
  switch (severity) {
    case "CRITICAL":
      return "border-red-300 bg-red-50 text-red-900";
    case "WARNING":
      return "border-amber-300 bg-amber-50 text-amber-900";
    case "ADVISORY":
      return "border-brand/30 bg-brand/10 text-brand";
    default:
      return "border-border bg-background text-foreground";
  }
}

export function CommunityAlertsPanel({ alerts }: Props) {
  const { dictionary: t } = useLocale();
  const [viewLogged, setViewLogged] = useState(false);

  useEffect(() => {
    if (alerts.length > 0 && !viewLogged) {
      setViewLogged(true);
      void logActivityEvent(
        ACTIVITY_EVENT_KIND.COMMUNITY_ALERT_VIEWED,
        "Community alerts viewed",
        alerts[0]?.title,
      );
    }
  }, [alerts, viewLogged]);

  return (
    <DashboardCard>
      <h2 className="text-lg font-semibold text-foreground">{t.dashboard.communityAlerts}</h2>
      {alerts.length === 0 ? (
        <p className="mt-3 text-sm text-muted">No community alerts at this time.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {alerts.map((alert) => (
            <li
              key={alert.id}
              className={[
                "min-w-0 rounded-xl border p-4",
                severityClasses(alert.severity),
              ].join(" ")}
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold uppercase">{alert.severity}</span>
                <LocalDateTime value={alert.createdAt} mode="date" className="text-xs opacity-80" />
              </div>
              <p className="mt-2 text-sm font-semibold">{alert.title}</p>
              <p className="mt-1 text-sm opacity-90">{alert.description}</p>
            </li>
          ))}
        </ul>
      )}
    </DashboardCard>
  );
}
