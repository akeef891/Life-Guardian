import type { Metadata } from "next";
import { EmergencyCard } from "@/components/EmergencyCard";
import { PageHeader } from "@/components/PageHeader";
import { EmergencyContactsManager } from "@/components/profile/EmergencyContactsManager";
import { EmergencyProfileForm } from "@/components/profile/EmergencyProfileForm";
import { getOrCreateCurrentUserWithProfile } from "@/lib/auth/user-context";
import type { EmergencyContactRecord } from "@/lib/db/prisma-types";

export const metadata: Metadata = {
  title: "Emergency Profile",
  description: "Manage your emergency medical profile and contacts.",
};

function formatDate(value: Date | null | undefined) {
  if (!value) {
    return "";
  }
  return value.toISOString().split("T")[0];
}

function toEmergencyCardContact(contact: EmergencyContactRecord) {
  return {
    name: contact.name,
    relationship: contact.relationship ?? undefined,
    phone: contact.phone,
    isPrimary: contact.isPrimary,
  };
}

export default async function EmergencyProfilePage() {
  const { profile, firstName, lastName, email } = await getOrCreateCurrentUserWithProfile();
  const fallbackName = [firstName, lastName].filter(Boolean).join(" ") || email;
  const displayName = profile?.displayName ?? fallbackName;

  return (
    <>
      <PageHeader
        title="Emergency Profile"
        description="Manage and persist your emergency medical information securely."
      />

      <div className="mx-auto w-full max-w-6xl px-3 sm:px-0">
        <div className="grid gap-8 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-surface p-6">
          <h2 className="text-lg font-semibold text-foreground">Profile editor</h2>
          <p className="mt-2 text-sm text-muted">
            Data is saved to PostgreSQL and will remain after refresh.
          </p>

          <div className="mt-6">
            <EmergencyProfileForm
              initialValues={{
                displayName: profile?.displayName ?? "",
                dateOfBirth: formatDate(profile?.dateOfBirth),
                bloodType: profile?.bloodType ?? "",
                allergies: profile?.allergies ?? "",
                medications: profile?.medications ?? "",
                medicalConditions: profile?.medicalConditions ?? "",
                notes: profile?.notes ?? "",
                primaryLanguage: profile?.primaryLanguage ?? "en",
              }}
            />
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-lg font-semibold text-foreground">
            Preview — public emergency card
          </h2>
          <EmergencyCard
            data={{
              displayName,
              bloodType: profile?.bloodType ?? undefined,
              allergies: profile?.allergies ?? undefined,
              medications: profile?.medications ?? undefined,
              medicalConditions: profile?.medicalConditions ?? undefined,
              notes: profile?.notes ?? undefined,
              emergencyContacts: profile?.contacts.map(toEmergencyCardContact) ?? [],
            }}
          />
        </section>
        </div>

        <div className="mt-8 sm:mt-10">
          <EmergencyContactsManager contacts={profile?.contacts ?? []} />
        </div>
      </div>
    </>
  );
}
