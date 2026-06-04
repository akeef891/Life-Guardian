import { prisma } from "@/lib/db/prisma";
import type { EmergencyContactRecord } from "@/lib/db/prisma-types";
import { buildResponseUrl } from "@/lib/services/sos-response.service";
import {
  buildSosEmergencyMessage,
  formatLocationLabel,
  prepareContactDeliveryPayloads,
  resolveMapsUrl,
} from "@/lib/services/sos-delivery.service";
import type { SosConfirmationDto, SosLocationInput } from "@/types/sos";

export const SOS_MIN_INTERVAL_MS = 30_000;
export const SOS_DEDUPE_WINDOW_MS = 5_000;

export type SosGuardResult =
  | { allowed: true }
  | { allowed: false; error: string; retryAfterSeconds: number };

export async function checkSosRateLimit(userId: string): Promise<SosGuardResult> {
  const latest = await prisma.sOSAlert.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: { createdAt: true },
  });

  if (!latest) {
    return { allowed: true };
  }

  const elapsed = Date.now() - latest.createdAt.getTime();
  if (elapsed >= SOS_MIN_INTERVAL_MS) {
    return { allowed: true };
  }

  const retryAfterSeconds = Math.ceil((SOS_MIN_INTERVAL_MS - elapsed) / 1000);
  return {
    allowed: false,
    error: "Please wait before sending another SOS alert.",
    retryAfterSeconds,
  };
}

type RebuildConfirmationInput = {
  senderName: string;
  message: string | null;
  location: SosLocationInput;
  contacts: EmergencyContactRecord[];
};

function rebuildConfirmationFromAlert(
  alert: {
    id: string;
    message: string | null;
    latitude: number | null;
    longitude: number | null;
    locationAccuracy: number | null;
    accuracy: number | null;
    mapsUrl: string | null;
    deliveredCount: number;
    deliveryStatus: string;
    createdAt: Date;
  },
  input: RebuildConfirmationInput,
  responseTokens: Array<{ contactId: string; token: string }>,
): SosConfirmationDto {
  const location: SosLocationInput = {
    latitude: alert.latitude,
    longitude: alert.longitude,
    accuracy: alert.locationAccuracy ?? alert.accuracy,
    capturedAt: alert.createdAt,
  };
  const mapsUrl = alert.mapsUrl ?? resolveMapsUrl(location);
  const responseUrlByContactId = new Map(
    responseTokens.map((r) => [r.contactId, buildResponseUrl(r.token)]),
  );

  const deliveryLinks = prepareContactDeliveryPayloads(
    input.contacts,
    (contact) =>
      buildSosEmergencyMessage({
        senderName: input.senderName,
        message: input.message ?? alert.message,
        mapsUrl,
        sentAt: alert.createdAt,
        responseUrl: responseUrlByContactId.get(contact.id) ?? null,
      }),
    responseUrlByContactId,
  );

  return {
    alertId: alert.id,
    contactsNotified: alert.deliveredCount,
    locationLabel: formatLocationLabel(location),
    mapsUrl,
    latitude: alert.latitude,
    longitude: alert.longitude,
    locationAccuracy: alert.locationAccuracy ?? alert.accuracy,
    sentAt: alert.createdAt.toISOString(),
    deliveryStatus: alert.deliveryStatus as SosConfirmationDto["deliveryStatus"],
    deliveryLinks,
  };
}

/**
 * If an SOS was created within the dedupe window, return its confirmation (idempotent).
 */
export async function findDuplicateSosConfirmation(
  userId: string,
  input: RebuildConfirmationInput,
): Promise<SosConfirmationDto | null> {
  const since = new Date(Date.now() - SOS_DEDUPE_WINDOW_MS);
  const recent = await prisma.sOSAlert.findFirst({
    where: {
      userId,
      createdAt: { gte: since },
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      message: true,
      latitude: true,
      longitude: true,
      locationAccuracy: true,
      accuracy: true,
      mapsUrl: true,
      deliveredCount: true,
      deliveryStatus: true,
      createdAt: true,
      responses: { select: { contactId: true, token: true } },
    },
  });

  if (!recent) {
    return null;
  }

  return rebuildConfirmationFromAlert(recent, input, recent.responses);
}
