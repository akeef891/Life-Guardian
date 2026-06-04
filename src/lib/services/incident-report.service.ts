import { prisma } from "@/lib/db/prisma";
import {
  CONTACT_RESPONSE_STATUS,
  type ContactResponseStatus,
} from "@/types/emergency-response";

export type IncidentReportData = {
  alertId: string;
  timestamp: Date;
  message: string | null;
  locationLabel: string;
  mapsUrl: string | null;
  contactsNotified: number;
  escalationStatus: string;
  incidentStatus: string;
  responses: Array<{
    contactName: string;
    status: ContactResponseStatus;
    respondedAt: Date | null;
  }>;
};

export async function getIncidentReportForUser(
  userId: string,
  alertId: string,
): Promise<IncidentReportData | null> {
  const alert = await prisma.sOSAlert.findFirst({
    where: { id: alertId, userId },
    include: {
      responses: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!alert) {
    return null;
  }

  const locationLabel =
    alert.latitude != null && alert.longitude != null
      ? `${alert.latitude.toFixed(6)}, ${alert.longitude.toFixed(6)}`
      : "Location unavailable";

  return {
    alertId: alert.id,
    timestamp: alert.createdAt,
    message: alert.message,
    locationLabel,
    mapsUrl: alert.mapsUrl,
    contactsNotified: alert.deliveredCount,
    escalationStatus: alert.escalationStatus,
    incidentStatus: alert.status,
    responses: alert.responses.map((r) => ({
      contactName: r.contactName,
      status: r.status as ContactResponseStatus,
      respondedAt: r.respondedAt,
    })),
  };
}

export function formatResponseSummary(
  responses: IncidentReportData["responses"],
): string {
  const answered = responses.filter(
    (r) => r.status !== CONTACT_RESPONSE_STATUS.PENDING,
  ).length;
  return `${answered} of ${responses.length} responded`;
}
