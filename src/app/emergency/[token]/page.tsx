import { notFound } from "next/navigation";
import { EmergencyCard } from "@/components/EmergencyCard";
import type { PublicEmergencyContact } from "@/lib/db/prisma-types";
import { getPublicEmergencyProfileByToken } from "@/lib/services/emergency-profile.service";

type EmergencyTokenPageProps = {
  params: Promise<{ token: string }>;
};

function toEmergencyCardContact(contact: PublicEmergencyContact) {
  return {
    name: contact.name,
    relationship: contact.relationship ?? undefined,
    phone: contact.phone,
    isPrimary: contact.isPrimary,
  };
}

export default async function EmergencyTokenPage({ params }: EmergencyTokenPageProps) {
  const { token } = await params;
  const profile = await getPublicEmergencyProfileByToken(token);

  if (!profile) {
    notFound();
  }

  return (
    <main className="mx-auto flex w-full min-w-0 max-w-3xl flex-1 overflow-x-hidden px-3 py-8 sm:px-6 sm:py-10">
      <div className="w-full min-w-0">
        <p className="mb-4 text-sm font-medium text-muted">Public Emergency Card</p>
        <EmergencyCard
          data={{
            displayName: profile.displayName ?? "Emergency Profile",
            bloodType: profile.bloodType ?? undefined,
            allergies: profile.allergies ?? undefined,
            medications: profile.medications ?? undefined,
            medicalConditions: profile.medicalConditions ?? undefined,
            emergencyContacts: profile.contacts.map(toEmergencyCardContact),
          }}
        />
      </div>
    </main>
  );
}
