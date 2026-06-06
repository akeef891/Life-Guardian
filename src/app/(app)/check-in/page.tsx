import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { SafetyCheckInPanel } from "@/components/check-in/SafetyCheckInPanel";
import { getOrCreateCurrentUserWithProfile } from "@/lib/auth/user-context";
import { getLatestSafetyCheckIn } from "@/lib/services/safety-check-in.service";
import { getServerLocale } from "@/lib/i18n/server-locale";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import type { SafetyCheckInStatus } from "@/types/safety-check-in";

export const metadata: Metadata = {
  title: "Safety Check-In",
  description: "Family safety check-in for Life Guardian.",
};

export default async function CheckInPage() {
  const { id: userId } = await getOrCreateCurrentUserWithProfile();
  const latest = await getLatestSafetyCheckIn(userId);
  const locale = await getServerLocale();
  const t = getDictionary(locale);

  return (
    <div className="min-w-0">
      <PageHeader title={t.checkIn.title} description={t.checkIn.description} />
      <SafetyCheckInPanel
        latestStatus={(latest?.status as SafetyCheckInStatus) ?? null}
        latestAt={latest ? latest.createdAt.toISOString() : null}
      />
    </div>
  );
}
