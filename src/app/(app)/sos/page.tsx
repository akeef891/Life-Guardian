import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { SOSHistoryListLazy } from "@/components/sos/sos-lazy";
import { SOSTriggerPanel } from "@/components/sos/SOSTriggerPanel";
import { getOrCreateCurrentUserWithProfile } from "@/lib/auth/user-context";
import { prisma } from "@/lib/db/prisma";
import { processPendingEscalations } from "@/lib/services/sos-escalation.service";

export const metadata: Metadata = {
  title: "SOS",
  description: "Trigger an emergency SOS alert to your contacts.",
};

export default async function SOSPage() {
  const { id: userId } = await getOrCreateCurrentUserWithProfile();
  await processPendingEscalations(userId);
  const alerts = await prisma.sOSAlert.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 10,
    select: {
      id: true,
      status: true,
      escalationStatus: true,
      message: true,
      latitude: true,
      longitude: true,
      accuracy: true,
      locationAccuracy: true,
      locationCapturedAt: true,
      mapsUrl: true,
      deliveredCount: true,
      deliveryStatus: true,
      createdAt: true,
    },
  });

  return (
    <>
      <PageHeader
        title="SOS Alert"
        description="Create SOS alert events and track your recent history."
      />

      <div className="mx-auto w-full min-w-0 max-w-3xl overflow-x-hidden px-1 sm:px-0">
        <SOSTriggerPanel />
        <SOSHistoryListLazy alerts={alerts} />
      </div>
    </>
  );
}
