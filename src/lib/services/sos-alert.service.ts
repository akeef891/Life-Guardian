import { prisma } from "@/lib/db/prisma";
import type { EmergencyContactRecord } from "@/lib/db/prisma-types";
import {
  createContactResponsesForAlert,
} from "@/lib/services/sos-response.service";
import {
  SOS_STATUS_ACTIVE,
  type CreateSosAlertInput,
  type SosConfirmationDto,
  type SosLocationInput,
} from "@/types/sos";
import { isValidIanaTimeZone } from "@/lib/datetime/format-datetime";
import {
  buildSosEmergencyMessage,
  formatLocationLabel,
  prepareContactDeliveryPayloads,
  resolveDeliveryStatus,
  resolveMapsUrl,
} from "@/lib/services/sos-delivery.service";

export async function createSosAlertWithDelivery(
  input: CreateSosAlertInput,
): Promise<SosConfirmationDto> {
  const mapsUrl = resolveMapsUrl(input.location);
  const sentAt = new Date();
  const deliveryStatus = resolveDeliveryStatus(input.contacts.length);

  const alert = await prisma.sOSAlert.create({
    data: {
      userId: input.userId,
      message: input.message,
      status: SOS_STATUS_ACTIVE,
      latitude: input.location.latitude,
      longitude: input.location.longitude,
      accuracy: input.location.accuracy,
      locationAccuracy: input.location.accuracy,
      locationCapturedAt: input.location.capturedAt,
      mapsUrl,
      deliveredCount: input.contacts.length,
      deliveryStatus,
    },
  });

  const responseRecords = await createContactResponsesForAlert(alert.id, input.contacts);
  const responseUrlByContactId = new Map(
    responseRecords.map((r) => [r.contactId, r.responseUrl]),
  );

  const deliveryLinks = prepareContactDeliveryPayloads(
    input.contacts,
    (contact) =>
      buildSosEmergencyMessage({
        senderName: input.senderName,
        message: input.message,
        mapsUrl,
        sentAt,
        responseUrl: responseUrlByContactId.get(contact.id) ?? null,
        clientTimeZone: input.clientTimeZone,
      }),
    responseUrlByContactId,
  );

  return {
    alertId: alert.id,
    contactsNotified: deliveryLinks.length,
    locationLabel: formatLocationLabel(input.location),
    mapsUrl,
    latitude: input.location.latitude,
    longitude: input.location.longitude,
    locationAccuracy: input.location.accuracy,
    sentAt: sentAt.toISOString(),
    deliveryStatus,
    deliveryLinks,
  };
}

export type SosDashboardStats = {
  totalSent: number;
  lastSosAt: Date | null;
};

export async function getSosDashboardStats(userId: string): Promise<SosDashboardStats> {
  const [totalSent, latest] = await Promise.all([
    prisma.sOSAlert.count({ where: { userId } }),
    prisma.sOSAlert.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: { createdAt: true },
    }),
  ]);

  return {
    totalSent,
    lastSosAt: latest?.createdAt ?? null,
  };
}

export function parseClientTimeZoneFromForm(formData: FormData): string | null {
  const raw = toNullable(formData.get("clientTimeZone"));
  if (!raw || !isValidIanaTimeZone(raw)) {
    return null;
  }
  return raw;
}

export function parseSosLocationFromForm(formData: FormData): SosLocationInput {
  const latitude = parseNullableFloat(toNullable(formData.get("latitude")));
  const longitude = parseNullableFloat(toNullable(formData.get("longitude")));
  const accuracy = parseNullableFloat(toNullable(formData.get("accuracy")));
  const capturedAtRaw = toNullable(formData.get("locationCapturedAt"));
  const capturedAt =
    capturedAtRaw != null && !Number.isNaN(Date.parse(capturedAtRaw))
      ? new Date(capturedAtRaw)
      : null;

  return { latitude, longitude, accuracy, capturedAt };
}

function toNullable(value: FormDataEntryValue | null): string | null {
  if (typeof value !== "string") {
    return null;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function parseNullableFloat(value: string | null): number | null {
  if (!value) {
    return null;
  }
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function isValidSosCoordinates(location: SosLocationInput): boolean {
  const { latitude, longitude } = location;
  const latOk = latitude === null || (latitude >= -90 && latitude <= 90);
  const lngOk = longitude === null || (longitude >= -180 && longitude <= 180);
  return latOk && lngOk;
}

export function resolveSenderName(
  profileDisplayName: string | null | undefined,
  firstName: string | null | undefined,
  email: string,
): string {
  return profileDisplayName ?? firstName ?? email;
}

export type { EmergencyContactRecord };
