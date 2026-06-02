import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { DashboardQuickActions } from "@/components/dashboard/DashboardQuickActions";
import { EmergencyActivityTimeline } from "@/components/dashboard/EmergencyActivityTimeline";
import { EmergencyReadinessScoreCard } from "@/components/dashboard/EmergencyReadinessScore";
import { EmergencyStatsCards } from "@/components/dashboard/EmergencyStatsCards";
import { getOrCreateCurrentUserWithProfile } from "@/lib/auth/user-context";
import { prisma } from "@/lib/db/prisma";
import { calculateEmergencyReadiness } from "@/lib/dashboard/calculate-emergency-readiness";
import { buildEmergencyActivityTimeline } from "@/lib/dashboard/dashboard-timeline";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your Life Guardian dashboard overview.",
};

export default async function DashboardPage() {
  const { id: userId, firstName, email, profile } = await getOrCreateCurrentUserWithProfile();
  const contacts = profile?.contacts ?? [];

  const [sosAlerts, sosCount] = await Promise.all([
    prisma.sOSAlert.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true,
        createdAt: true,
        message: true,
      },
    }),
    prisma.sOSAlert.count({
      where: { userId },
    }),
  ]);

  const readiness = calculateEmergencyReadiness({
    profile,
    contacts,
    qrToken: profile?.qrToken ?? null,
    sosAlertsCount: sosCount,
  });
  const profileCompleted =
    readiness.items.find((i) => i.key === "profile_completed")?.achieved ?? false;
  const qrEnabled = readiness.items.find((i) => i.key === "qr_generated")?.achieved ?? false;

  const timelineEvents = buildEmergencyActivityTimeline({
    profile,
    contacts,
    qrToken: profile?.qrToken ?? null,
    sosAlerts,
  });

  const greetingName = firstName ?? email;

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description={`Welcome ${greetingName}. Quick access to your emergency tools.`}
      />

      <div className="mx-auto w-full max-w-6xl px-1 sm:px-0">
        <EmergencyStatsCards
          profileCompleted={profileCompleted}
          contactsCount={contacts.length}
          sosCount={sosCount}
          qrEnabled={qrEnabled}
        />

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <EmergencyReadinessScoreCard score={readiness.score} items={readiness.items} />
          </div>
          <div className="lg:col-span-1">
            <DashboardQuickActions />
          </div>
          <div className="hidden lg:block lg:col-span-1">
            <div className="rounded-2xl border border-border bg-surface p-6">
              <h2 className="text-lg font-semibold text-foreground">What to do next</h2>
              <p className="mt-1 text-sm text-muted">
                Your score updates as you complete your emergency setup.
              </p>
              <ul className="mt-4 space-y-3">
                {readiness.items.map((item) => (
                  <li key={item.key} className="flex items-start gap-3">
                    <span
                      className={[
                        "mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full border text-xs font-bold",
                        item.achieved
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : "border-border bg-background text-muted",
                      ].join(" ")}
                    >
                      {item.achieved ? "ON" : "OFF"}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground">{item.label}</p>
                      <p className="text-xs text-muted">
                        {item.achieved ? "Complete" : "Still needed to improve readiness"}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-5 rounded-xl bg-background p-4 text-sm text-muted">
                Tip: QR + SOS history make the dashboard most useful during emergencies.
              </div>
            </div>
          </div>
        </div>

        <EmergencyActivityTimeline events={timelineEvents} />
      </div>
    </div>
  );
}
