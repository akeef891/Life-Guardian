export const COMMUNITY_ALERT_SEVERITY = {
  INFO: "INFO",
  ADVISORY: "ADVISORY",
  WARNING: "WARNING",
  CRITICAL: "CRITICAL",
} as const;

export type CommunityAlertSeverity =
  (typeof COMMUNITY_ALERT_SEVERITY)[keyof typeof COMMUNITY_ALERT_SEVERITY];

export type CommunityAlertDto = {
  id: string;
  title: string;
  description: string;
  severity: CommunityAlertSeverity;
  createdAt: Date;
};
