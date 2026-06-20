import {
  CONTACT_RESPONSE_STATUS,
  SOS_ESCALATION_STATUS,
} from "@/types/emergency-response";

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
  | "sos_triggered"
  | "sos_created"
  | "contact_responded"
  | "escalation_triggered"
  | "incident_closed"
  | "check_in_created"
  | "community_alert_viewed"
  | "resource_opened";

export type EmergencyTimelineEvent = {
  id: string;
  kind: EmergencyTimelineEventKind;
  title: string;
  description?: string;
  at: Date;
  /** Present on SOS-related events for owner actions (delete, PDF). */
  alertId?: string;
  mapsUrl?: string | null;
};

type SosAlertTimelineRow = {
  id: string;
  createdAt: Date;
  message: string | null;
  mapsUrl?: string | null;
  deliveredCount?: number;
  deliveryStatus?: string;
  status: string;
  escalationStatus: string;
  escalatedAt: Date | null;
  closedAt: Date | null;
  responses: Array<{
    id: string;
    contactName: string;
    status: string;
    respondedAt: Date | null;
    updatedAt: Date;
  }>;
};

type SafetyCheckInRow = {
  id: string;
  status: string;
  note: string | null;
  createdAt: Date;
};

type ActivityLogRow = {
  id: string;
  eventKind: string;
  title: string;
  description: string | null;
  createdAt: Date;
};

type BuildInput = {
  profile: EmergencyProfileLike | null;
  contacts: EmergencyContactLike[];
  qrToken: string | null;
  sosAlerts: SosAlertTimelineRow[];
  safetyCheckIns?: SafetyCheckInRow[];
  activityLogs?: ActivityLogRow[];
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

function pushSosAlertEvents(events: EmergencyTimelineEvent[], sos: SosAlertTimelineRow): void {
  const deliveryNote =
    sos.deliveredCount != null && sos.deliveredCount > 0
      ? `${sos.deliveredCount} contact(s) notified.`
      : "SOS alert logged.";

  events.push({
    id: `sos_created_${sos.id}`,
    kind: "sos_created",
    title: "SOS Created",
    description: sos.message ? `${sos.message} — ${deliveryNote}` : deliveryNote,
    at: sos.createdAt,
    alertId: sos.id,
    mapsUrl: sos.mapsUrl ?? null,
  });

  events.push({
    id: `sos_triggered_${sos.id}`,
    kind: "sos_triggered",
    title: "SOS Triggered",
    description: deliveryNote,
    at: sos.createdAt,
    alertId: sos.id,
  });

  for (const response of sos.responses) {
    if (response.status === CONTACT_RESPONSE_STATUS.PENDING || !response.respondedAt) {
      continue;
    }
    events.push({
      id: `contact_responded_${response.id}`,
      kind: "contact_responded",
      title: "Contact Responded",
      description: `${response.contactName} marked as ${response.status}.`,
      at: response.respondedAt,
    });
  }

  if (
    sos.escalationStatus === SOS_ESCALATION_STATUS.ESCALATED &&
    sos.escalatedAt
  ) {
    events.push({
      id: `escalation_triggered_${sos.id}`,
      kind: "escalation_triggered",
      title: "Escalation Triggered",
      description: "No contact response received in time. Alert escalated.",
      at: sos.escalatedAt,
      alertId: sos.id,
    });
  }

  if (sos.status === "CLOSED" && sos.closedAt) {
    events.push({
      id: `incident_closed_${sos.id}`,
      kind: "incident_closed",
      title: "Incident Closed",
      description: "All contacts responded or incident was resolved.",
      at: sos.closedAt,
      alertId: sos.id,
    });
  }
}

function mapActivityKind(eventKind: string): EmergencyTimelineEventKind | null {
  switch (eventKind) {
    case "CHECK_IN_CREATED":
      return "check_in_created";
    case "COMMUNITY_ALERT_VIEWED":
      return "community_alert_viewed";
    case "RESOURCE_OPENED":
      return "resource_opened";
    default:
      return null;
  }
}

export function buildEmergencyActivityTimeline({
  profile,
  contacts,
  qrToken,
  sosAlerts,
  safetyCheckIns = [],
  activityLogs = [],
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
    pushSosAlertEvents(events, sos);
  }

  for (const checkIn of safetyCheckIns) {
    events.push({
      id: `check_in_${checkIn.id}`,
      kind: "check_in_created",
      title: "Safety Check-In",
      description: checkIn.note
        ? `${checkIn.status} — ${checkIn.note}`
        : checkIn.status,
      at: checkIn.createdAt,
    });
  }

  for (const log of activityLogs) {
    const kind = mapActivityKind(log.eventKind);
    if (!kind || kind === "check_in_created") {
      continue;
    }
    events.push({
      id: `activity_${log.id}`,
      kind,
      title: log.title,
      description: log.description ?? undefined,
      at: log.createdAt,
    });
  }

  events.sort((a, b) => b.at.getTime() - a.at.getTime());

  return events.slice(0, 30);
}
