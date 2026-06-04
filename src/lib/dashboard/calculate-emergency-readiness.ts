import {
  calculateCompletionBreakdown,
  type CompletionBreakdown,
} from "./calculate-completion";

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

export type ReadinessStatus = "needs_attention" | "good" | "emergency_ready";

export type EmergencyReadinessFactorKey =
  | "profile_completion"
  | "medical_completion"
  | "contacts_setup"
  | "qr_generated"
  | "sos_tested";

export type EmergencyReadinessFactor = {
  key: EmergencyReadinessFactorKey;
  label: string;
  achieved: boolean;
  points: number;
  maxPoints: number;
};

export type EmergencyReadinessResult = {
  score: number;
  status: ReadinessStatus;
  statusLabel: string;
  completion: CompletionBreakdown;
  factors: EmergencyReadinessFactor[];
};

type CalculateInput = {
  profile: EmergencyProfileLike | null;
  contacts: EmergencyContactLike[];
  qrToken: string | null;
  sosAlertsCount: number;
};

const PROFILE_WEIGHT = 15;
const MEDICAL_WEIGHT = 25;
const CONTACTS_WEIGHT = 20;
const QR_WEIGHT = 20;
const SOS_WEIGHT = 20;

function resolveReadinessStatus(score: number): {
  status: ReadinessStatus;
  statusLabel: string;
} {
  if (score >= 80) {
    return { status: "emergency_ready", statusLabel: "Emergency Ready" };
  }
  if (score >= 50) {
    return { status: "good", statusLabel: "Good" };
  }
  return { status: "needs_attention", statusLabel: "Needs Attention" };
}

function scoreFromPercent(percent: number, maxPoints: number): number {
  return Math.round((Math.max(0, Math.min(100, percent)) / 100) * maxPoints);
}

export function calculateEmergencyReadiness({
  profile,
  contacts,
  qrToken,
  sosAlertsCount,
}: CalculateInput): EmergencyReadinessResult {
  const completion = calculateCompletionBreakdown({ profile, contacts, qrToken });

  const profilePoints = scoreFromPercent(completion.profile, PROFILE_WEIGHT);
  const medicalPoints = scoreFromPercent(completion.medical, MEDICAL_WEIGHT);
  const contactsPoints = scoreFromPercent(completion.contacts, CONTACTS_WEIGHT);
  const qrPoints = qrToken ? QR_WEIGHT : 0;
  const sosPoints = sosAlertsCount > 0 ? SOS_WEIGHT : 0;

  const factors: EmergencyReadinessFactor[] = [
    {
      key: "profile_completion",
      label: "Profile completion",
      achieved: completion.profile >= 100,
      points: profilePoints,
      maxPoints: PROFILE_WEIGHT,
    },
    {
      key: "medical_completion",
      label: "Medical information",
      achieved: completion.medical >= 80,
      points: medicalPoints,
      maxPoints: MEDICAL_WEIGHT,
    },
    {
      key: "contacts_setup",
      label: "Emergency contacts",
      achieved: completion.contacts >= 75,
      points: contactsPoints,
      maxPoints: CONTACTS_WEIGHT,
    },
    {
      key: "qr_generated",
      label: "QR card generated",
      achieved: Boolean(qrToken),
      points: qrPoints,
      maxPoints: QR_WEIGHT,
    },
    {
      key: "sos_tested",
      label: "SOS tested",
      achieved: sosAlertsCount > 0,
      points: sosPoints,
      maxPoints: SOS_WEIGHT,
    },
  ];

  const score = Math.min(
    100,
    factors.reduce((sum, factor) => sum + factor.points, 0),
  );
  const { status, statusLabel } = resolveReadinessStatus(score);

  return {
    score,
    status,
    statusLabel,
    completion,
    factors,
  };
}

/** @deprecated Use EmergencyReadinessResult — kept for gradual migration */
export type EmergencyReadinessItem = EmergencyReadinessFactor;
export type EmergencyReadinessScore = EmergencyReadinessResult;
