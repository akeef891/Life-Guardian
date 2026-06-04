import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { CompletionTrackingPanel } from "@/components/dashboard/CompletionTrackingPanel";
import { DashboardQuickActions } from "@/components/dashboard/DashboardQuickActions";
import { EmergencyActivityTimeline } from "@/components/dashboard/EmergencyActivityTimeline";
import { EmergencyReadinessScoreCard } from "@/components/dashboard/EmergencyReadinessScore";
import { EmergencySmartRecommendations } from "@/components/dashboard/EmergencySmartRecommendations";
import { EmergencyStatsCards } from "@/components/dashboard/EmergencyStatsCards";
import { getOrCreateCurrentUserWithProfile } from "@/lib/auth/user-context";
import { prisma } from "@/lib/db/prisma";
import { calculateEmergencyReadiness } from "@/lib/dashboard/calculate-emergency-readiness";
import { buildEmergencyActivityTimeline } from "@/lib/dashboard/dashboard-timeline";
import { generateDashboardRecommendations } from "@/lib/dashboard/generate-recommendations";
import { getSosDashboardStats } from "@/lib/services/sos-alert.service";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your Life Guardian emergency readiness center.",
};

export default async function DashboardPage() {
  const { id: userId, firstName, email, profile } = await getOrCreateCurrentUserWithProfile();
  const contacts = profile?.contacts ?? [];

  const [sosAlerts, sosStats] = await Promise.all([
    prisma.sOSAlert.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true,
        createdAt: true,
        message: true,
        deliveryStatus: true,
        deliveredCount: true,
      },
    }),
    getSosDashboardStats(userId),
  ]);

  const sosCount = sosStats.totalSent;
  const lastSosAt = sosStats.lastSosAt;
  const qrToken = profile?.qrToken ?? null;

  const readiness = calculateEmergencyReadiness({
    profile,
    contacts,
    qrToken,
    sosAlertsCount: sosCount,
  });

  const recommendations = generateDashboardRecommendations({
    profile,
    contactsCount: contacts.length,
    hasPrimaryContact: contacts.some((c) => c.isPrimary),
    qrToken,
    sosAlertsCount: sosCount,
    completion: readiness.completion,
  });

  const timelineEvents = buildEmergencyActivityTimeline({
    profile,
    contacts,
    qrToken,
    sosAlerts,
  });

  const greetingName = firstName ?? email;

  return (
    <div className="min-w-0">
      <PageHeader
        title="Emergency Dashboard"
        description={`Welcome ${greetingName}. Your readiness center for profiles, contacts, QR, and SOS.`}
      />

      <div className="mx-auto w-full min-w-0 max-w-6xl overflow-x-hidden px-1 sm:px-0">
        <EmergencyStatsCards
          readinessScore={readiness.score}
          readinessLabel={readiness.statusLabel}
          contactsCount={contacts.length}
          sosCount={sosCount}
          lastSosAt={lastSosAt}
          qrEnabled={Boolean(qrToken)}
        />

        <div className="mt-6 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          <EmergencyReadinessScoreCard
            score={readiness.score}
            status={readiness.status}
            statusLabel={readiness.statusLabel}
            factors={readiness.factors}
          />
          <CompletionTrackingPanel completion={readiness.completion} />
          <div className="lg:col-span-2 xl:col-span-1">
            <EmergencySmartRecommendations recommendations={recommendations} />
          </div>
        </div>

        <div className="mt-6">
          <DashboardQuickActions />
        </div>

        <EmergencyActivityTimeline events={timelineEvents} />
      </div>
    </div>
  );
}
