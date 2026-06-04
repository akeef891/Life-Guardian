export const CONTACT_RESPONSE_STATUS = {
  PENDING: "PENDING",
  RESPONDING: "RESPONDING",
  SAFE: "SAFE",
  UNAVAILABLE: "UNAVAILABLE",
} as const;

export type ContactResponseStatus =
  (typeof CONTACT_RESPONSE_STATUS)[keyof typeof CONTACT_RESPONSE_STATUS];

export const SOS_ESCALATION_STATUS = {
  NONE: "NONE",
  ESCALATED: "ESCALATED",
} as const;

export type SosEscalationStatus =
  (typeof SOS_ESCALATION_STATUS)[keyof typeof SOS_ESCALATION_STATUS];

export const SOS_INCIDENT_STATUS = {
  ACTIVE: "ACTIVE",
  CLOSED: "CLOSED",
} as const;

export type SosIncidentStatus =
  (typeof SOS_INCIDENT_STATUS)[keyof typeof SOS_INCIDENT_STATUS];

/** Escalate when no contact responds within this window (demo-friendly). */
export const SOS_ESCALATION_AFTER_MS = 3 * 60 * 1000;
