import type { Metadata } from "next";
import { EmergencyCard } from "@/components/EmergencyCard";
import { PageHeader } from "@/components/PageHeader";
import { QRCardPanel } from "@/components/qr/QRCardPanel";
import { getOrCreateCurrentUserWithProfile } from "@/lib/auth/user-context";
import type { EmergencyContactRecord } from "@/lib/db/prisma-types";

export const metadata: Metadata = {
  title: "QR Card",
  description: "Your scannable QR emergency card.",
};

const APP_BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://my-domain.com";

function toEmergencyCardContact(contact: EmergencyContactRecord) {
  return {
    name: contact.name,
    relationship: contact.relationship ?? undefined,
    phone: contact.phone,
  };
}

export default async function QRCardPage() {
  const { profile, firstName, lastName, email } = await getOrCreateCurrentUserWithProfile();
  const fallbackName = [firstName, lastName].filter(Boolean).join(" ") || email;
  const displayName = profile?.displayName ?? fallbackName;
  const emergencyUrl = profile?.qrToken ? `${APP_BASE_URL}/emergency/${profile.qrToken}` : null;

  return (
    <>
      <PageHeader
        title="QR Emergency Card"
        description="Share this card so others can access your emergency information by scanning a QR code."
      />

      <div className="mx-auto w-full max-w-6xl px-3 sm:px-0">
        <div className="grid gap-8 lg:grid-cols-2">
          <QRCardPanel emergencyUrl={emergencyUrl} appBaseUrl={APP_BASE_URL} />

          <section>
            <h2 className="mb-4 text-lg font-semibold text-foreground">Card preview</h2>
            <EmergencyCard
              data={{
                displayName,
                bloodType: profile?.bloodType ?? undefined,
                allergies: profile?.allergies ?? undefined,
                medications: profile?.medications ?? undefined,
                medicalConditions: profile?.medicalConditions ?? undefined,
                emergencyContacts: profile?.contacts.map(toEmergencyCardContact) ?? [],
              }}
            />
          </section>
        </div>
      </div>
    </>
  );
}
