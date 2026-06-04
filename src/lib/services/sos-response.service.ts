import { prisma } from "@/lib/db/prisma";
import type { EmergencyContactRecord } from "@/lib/db/prisma-types";
import { generateResponseToken } from "@/lib/utils/tokens";
import {
  CONTACT_RESPONSE_STATUS,
  type ContactResponseStatus,
} from "@/types/emergency-response";

const APP_BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export type ContactResponseRecord = {
  id: string;
  contactId: string;
  contactName: string;
  status: ContactResponseStatus;
  respondedAt: Date | null;
  responseUrl: string;
};

export function buildResponseUrl(token: string): string {
  return `${APP_BASE_URL}/respond/${token}`;
}

export async function createContactResponsesForAlert(
  sosAlertId: string,
  contacts: EmergencyContactRecord[],
): Promise<ContactResponseRecord[]> {
  if (contacts.length === 0) {
    return [];
  }

  const created = await prisma.$transaction(
    contacts.map((contact) =>
      prisma.sOSContactResponse.create({
        data: {
          sosAlertId,
          contactId: contact.id,
          contactName: contact.name,
          token: generateResponseToken(),
          status: CONTACT_RESPONSE_STATUS.PENDING,
        },
        select: {
          id: true,
          contactId: true,
          contactName: true,
          status: true,
          respondedAt: true,
          token: true,
        },
      }),
    ),
  );

  return created.map((row) => ({
    id: row.id,
    contactId: row.contactId,
    contactName: row.contactName,
    status: row.status as ContactResponseStatus,
    respondedAt: row.respondedAt,
    responseUrl: buildResponseUrl(row.token),
  }));
}

export async function getResponseByToken(token: string) {
  return prisma.sOSContactResponse.findUnique({
    where: { token },
    include: {
      sosAlert: {
        select: {
          id: true,
          message: true,
          createdAt: true,
          mapsUrl: true,
          escalationStatus: true,
          status: true,
          user: {
            select: {
              firstName: true,
              email: true,
              profile: { select: { displayName: true } },
            },
          },
        },
      },
    },
  });
}

export async function updateContactResponseStatus(
  token: string,
  status: ContactResponseStatus,
): Promise<{ success: boolean; error?: string }> {
  const existing = await prisma.sOSContactResponse.findUnique({
    where: { token },
    select: { id: true, sosAlertId: true, status: true },
  });

  if (!existing) {
    return { success: false, error: "Response link not found or expired." };
  }

  if (existing.status === status) {
    return { success: true };
  }

  await prisma.sOSContactResponse.update({
    where: { id: existing.id },
    data: {
      status,
      respondedAt: new Date(),
    },
  });

  await maybeCloseIncident(existing.sosAlertId);

  return { success: true };
}

async function maybeCloseIncident(sosAlertId: string): Promise<void> {
  const responses = await prisma.sOSContactResponse.findMany({
    where: { sosAlertId },
    select: { status: true },
  });

  if (responses.length === 0) {
    return;
  }

  const allAnswered = responses.every(
    (r) => r.status !== CONTACT_RESPONSE_STATUS.PENDING,
  );

  if (!allAnswered) {
    return;
  }

  await prisma.sOSAlert.update({
    where: { id: sosAlertId },
    data: {
      status: "CLOSED",
      closedAt: new Date(),
    },
  });
}

export type LiveSosResponseState = {
  alertId: string;
  createdAt: Date;
  escalationStatus: string;
  status: string;
  responses: ContactResponseRecord[];
};

export async function getLatestLiveSosResponse(userId: string): Promise<LiveSosResponseState | null> {
  const alert = await prisma.sOSAlert.findFirst({
    where: {
      userId,
      status: "ACTIVE",
    },
    orderBy: { createdAt: "desc" },
    include: {
      responses: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!alert) {
    return null;
  }

  return {
    alertId: alert.id,
    createdAt: alert.createdAt,
    escalationStatus: alert.escalationStatus,
    status: alert.status,
    responses: alert.responses.map((r) => ({
      id: r.id,
      contactId: r.contactId,
      contactName: r.contactName,
      status: r.status as ContactResponseStatus,
      respondedAt: r.respondedAt,
      responseUrl: buildResponseUrl(r.token),
    })),
  };
}
