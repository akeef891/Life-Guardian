import { buildGoogleMapsUrl } from "@/lib/geolocation/get-accurate-position";
import type { EmergencyContactRecord } from "@/lib/db/prisma-types";
import {
  SOS_DELIVERY_STATUS,
  type ContactDeliveryPayload,
  type SosDeliveryStatus,
  type SosLocationInput,
} from "@/types/sos";

type BuildMessageInput = {
  senderName: string;
  message: string | null;
  mapsUrl: string | null;
  sentAt: Date;
};

function formatAlertTime(sentAt: Date): string {
  return sentAt.toLocaleString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function buildSosEmergencyMessage(input: BuildMessageInput): string {
  const locationLine = input.mapsUrl ?? "Location unavailable";
  const timeLine = formatAlertTime(input.sentAt);

  const lines = [
    "\u{1F6A8} LIFE GUARDIAN EMERGENCY ALERT",
    "",
    `${input.senderName} has triggered an SOS alert.`,
  ];

  if (input.message) {
    lines.push("", `Message: ${input.message}`);
  }

  lines.push(
    "",
    "Location:",
    locationLine,
    "",
    "Time:",
    timeLine,
    "",
    "Please contact immediately.",
  );

  return lines.join("\n");
}

function stripPlusForWhatsApp(phone: string): string {
  return phone.replace(/^\+/, "");
}

export function buildWhatsAppUrl(phone: string, message: string): string {
  const digits = stripPlusForWhatsApp(phone);
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function buildSmsUrl(phone: string, message: string): string {
  const normalized = phone.replace(/\s/g, "");
  return `sms:${normalized}?body=${encodeURIComponent(message)}`;
}

export function prepareContactDeliveryPayloads(
  contacts: EmergencyContactRecord[],
  message: string,
): ContactDeliveryPayload[] {
  return contacts.map((contact) => ({
    contactId: contact.id,
    contactName: contact.name,
    phone: contact.phone,
    whatsAppUrl: buildWhatsAppUrl(contact.phone, message),
    smsUrl: buildSmsUrl(contact.phone, message),
  }));
}

export function resolveMapsUrl(location: SosLocationInput): string | null {
  if (location.latitude == null || location.longitude == null) {
    return null;
  }
  return buildGoogleMapsUrl(location.latitude, location.longitude);
}

export function resolveDeliveryStatus(contactCount: number): SosDeliveryStatus {
  if (contactCount === 0) {
    return SOS_DELIVERY_STATUS.NO_CONTACTS;
  }
  return SOS_DELIVERY_STATUS.PREPARED;
}

export function formatLocationLabel(location: SosLocationInput): string {
  if (location.latitude == null || location.longitude == null) {
    return "Location unavailable";
  }

  const accuracy =
    location.accuracy != null ? ` ±${Math.round(location.accuracy)}m` : "";
  return `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}${accuracy}`;
}
