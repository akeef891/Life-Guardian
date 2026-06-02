type EmergencyProfileLike = {
  bloodType?: string | null;
  dateOfBirth?: Date | null;
  allergies?: string | null;
  medications?: string | null;
  medicalConditions?: string | null;
  notes?: string | null;
};

type EmergencyContactLike = {
  isPrimary: boolean;
};

export type EmergencyReadinessItemKey =
  | "profile_completed"
  | "primary_contact_exists"
  | "qr_generated"
  | "has_sos_alert";

export type EmergencyReadinessItem = {
  key: EmergencyReadinessItemKey;
  label: string;
  achieved: boolean;
  points: number;
};

export type EmergencyReadinessScore = {
  score: number; // out of 100
  items: EmergencyReadinessItem[];
};

type CalculateInput = {
  profile: EmergencyProfileLike | null;
  contacts: EmergencyContactLike[];
  qrToken: string | null;
  sosAlertsCount: number;
};

function isProfileCompleted(profile: EmergencyProfileLike | null): boolean {
  if (!profile) {
    return false;
  }

  // "Completed" is intentionally pragmatic: a user may not fill everything,
  // but as soon as there is meaningful medical info, we consider it started.
  return Boolean(
    profile.bloodType ||
      profile.dateOfBirth ||
      profile.allergies ||
      profile.medications ||
      profile.medicalConditions ||
      profile.notes,
  );
}

export function calculateEmergencyReadiness({
  profile,
  contacts,
  qrToken,
  sosAlertsCount,
}: CalculateInput): EmergencyReadinessScore {
  const PROFILE_POINTS = 25;
  const PRIMARY_CONTACT_POINTS = 25;
  const QR_POINTS = 25;
  const SOS_POINTS = 25;

  const items: EmergencyReadinessItem[] = [
    {
      key: "profile_completed",
      label: "Profile Completed",
      achieved: isProfileCompleted(profile),
      points: PROFILE_POINTS,
    },
    {
      key: "primary_contact_exists",
      label: "Primary Contact",
      achieved: contacts.some((c) => c.isPrimary),
      points: PRIMARY_CONTACT_POINTS,
    },
    {
      key: "qr_generated",
      label: "QR Generated",
      achieved: Boolean(qrToken),
      points: QR_POINTS,
    },
    {
      key: "has_sos_alert",
      label: "SOS Triggered",
      achieved: sosAlertsCount > 0,
      points: SOS_POINTS,
    },
  ];

  const score = items.reduce((sum, item) => sum + (item.achieved ? item.points : 0), 0);
  return { score, items };
}

