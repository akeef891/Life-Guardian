export const SAFETY_CHECK_IN_STATUS = {
  SAFE: "SAFE",
  NEED_ASSISTANCE: "NEED_ASSISTANCE",
  TRAVELING: "TRAVELING",
} as const;

export type SafetyCheckInStatus =
  (typeof SAFETY_CHECK_IN_STATUS)[keyof typeof SAFETY_CHECK_IN_STATUS];

export const SAFETY_CHECK_IN_LABELS: Record<SafetyCheckInStatus, string> = {
  SAFE: "Mark Safe",
  NEED_ASSISTANCE: "Need Assistance",
  TRAVELING: "Traveling",
};
