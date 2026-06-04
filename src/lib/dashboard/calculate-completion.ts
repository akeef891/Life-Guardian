type EmergencyProfileLike = {
  displayName?: string | null;
  dateOfBirth?: Date | null;
  primaryLanguage?: string | null;
  bloodType?: string | null;
  allergies?: string | null;
  medications?: string | null;
  medicalConditions?: string | null;
  notes?: string | null;
};

type EmergencyContactLike = {
  isPrimary: boolean;
};

export type CompletionBreakdown = {
  profile: number;
  medical: number;
  contacts: number;
  qr: number;
};

function percentFilled(filled: number, total: number): number {
  if (total <= 0) {
    return 0;
  }
  return Math.round((filled / total) * 100);
}

export function calculateCompletionBreakdown(input: {
  profile: EmergencyProfileLike | null;
  contacts: EmergencyContactLike[];
  qrToken: string | null;
}): CompletionBreakdown {
  const profile = input.profile;

  const profileFields = [
    Boolean(profile?.displayName?.trim()),
    Boolean(profile?.dateOfBirth),
    Boolean(profile?.primaryLanguage?.trim()),
  ];
  const profilePercent = percentFilled(
    profileFields.filter(Boolean).length,
    profileFields.length,
  );

  const medicalFields = [
    Boolean(profile?.bloodType?.trim()),
    Boolean(profile?.allergies?.trim()),
    Boolean(profile?.medications?.trim()),
    Boolean(profile?.medicalConditions?.trim()),
    Boolean(profile?.notes?.trim()),
  ];
  const medicalPercent = percentFilled(
    medicalFields.filter(Boolean).length,
    medicalFields.length,
  );

  const contactCount = input.contacts.length;
  const hasPrimary = input.contacts.some((c) => c.isPrimary);
  let contactsPercent = 0;
  if (contactCount >= 2 && hasPrimary) {
    contactsPercent = 100;
  } else if (contactCount >= 1 && hasPrimary) {
    contactsPercent = 75;
  } else if (contactCount >= 1) {
    contactsPercent = 50;
  }

  const qrPercent = input.qrToken ? 100 : 0;

  return {
    profile: profilePercent,
    medical: medicalPercent,
    contacts: contactsPercent,
    qr: qrPercent,
  };
}
