type EmergencyProfileLike = {
  id: string;
  updatedAt: Date;
  displayName?: string | null;
  dateOfBirth?: Date | null;
  bloodType?: string | null;
  allergies?: string | null;
  medications?: string | null;
  medicalConditions?: string | null;
  notes?: string | null;
  qrToken?: string | null;
};

type EmergencyContactLike = {
  id: string;
  isPrimary: boolean;
  name: string;
  createdAt: Date;
};

export type EmergencyTimelineEventKind =
  | "profile_updated"
  | "contact_added"
  | "qr_generated"
  | "sos_triggered";

export type EmergencyTimelineEvent = {
  id: string;
  kind: EmergencyTimelineEventKind;
  title: string;
  description?: string;
  at: Date;
};

type BuildInput = {
  profile: EmergencyProfileLike | null;
  contacts: EmergencyContactLike[];
  qrToken: string | null;
  sosAlerts: Array<{
    id: string;
    createdAt: Date;
    message: string | null;
    deliveredCount?: number;
    deliveryStatus?: string;
  }>;
};

function hasAnyProfileContent(profile: EmergencyProfileLike | null): boolean {
  if (!profile) {
    return false;
  }

  return Boolean(
    profile.displayName ||
      profile.dateOfBirth ||
      profile.bloodType ||
      profile.allergies ||
      profile.medications ||
      profile.medicalConditions ||
      profile.notes,
  );
}

function formatContactLabel(contact: EmergencyContactLike): string {
  return contact.isPrimary ? `${contact.name} (Primary)` : contact.name;
}

export function buildEmergencyActivityTimeline({
  profile,
  contacts,
  qrToken,
  sosAlerts,
}: BuildInput): EmergencyTimelineEvent[] {
  const events: EmergencyTimelineEvent[] = [];

  if (profile && hasAnyProfileContent(profile)) {
    events.push({
      id: `profile_updated_${profile.id}`,
      kind: "profile_updated",
      title: "Profile Updated",
      description: profile.displayName
        ? `Emergency profile updated for ${profile.displayName}.`
        : "Emergency profile was updated.",
      at: profile.updatedAt,
    });
  }

  for (const contact of contacts) {
    events.push({
      id: `contact_added_${contact.id}`,
      kind: "contact_added",
      title: "Emergency Contact Added",
      description: formatContactLabel(contact),
      at: contact.createdAt,
    });
  }

  if (qrToken && profile) {
    events.push({
      id: `qr_generated_${profile.id}`,
      kind: "qr_generated",
      title: "QR Generated",
      description: "Your QR emergency card is ready to share.",
      at: profile.updatedAt,
    });
  }

  for (const sos of sosAlerts) {
    const deliveryNote =
      sos.deliveredCount != null && sos.deliveredCount > 0
        ? `${sos.deliveredCount} WhatsApp/SMS link(s) prepared.`
        : "SOS alert logged.";
    const desc = sos.message ? `${sos.message} — ${deliveryNote}` : deliveryNote;
    events.push({
      id: `sos_triggered_${sos.id}`,
      kind: "sos_triggered",
      title: "SOS Triggered",
      description: desc,
      at: sos.createdAt,
    });
  }

  events.sort((a, b) => b.at.getTime() - a.at.getTime());

  return events.slice(0, 20);
}
