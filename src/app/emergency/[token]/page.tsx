import { notFound } from "next/navigation";
import { EmergencyCard } from "@/components/EmergencyCard";
import { getPublicEmergencyProfileByToken } from "@/lib/services/emergency-profile.service";

type EmergencyTokenPageProps = {
  params: Promise<{ token: string }>;
};

export default async function EmergencyTokenPage({ params }: EmergencyTokenPageProps) {
  const { token } = await params;
  const profile = await getPublicEmergencyProfileByToken(token);

  if (!profile) {
    notFound();
  }

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 items-start px-4 py-10 sm:px-6">
      <div className="w-full">
        <p className="mb-4 text-sm font-medium text-muted">Public Emergency Card</p>
        <EmergencyCard
          data={{
            displayName: profile.displayName ?? "Emergency Profile",
            bloodType: profile.bloodType ?? undefined,
            allergies: profile.allergies ?? undefined,
            medications: profile.medications ?? undefined,
            medicalConditions: profile.medicalConditions ?? undefined,
            emergencyContacts: profile.contacts.map((contact) => ({
              name: contact.name,
              relationship: contact.relationship ?? undefined,
              phone: contact.phone,
              isPrimary: contact.isPrimary,
            })),
          }}
        />
      </div>
    </main>
  );
}
