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
  location: SosLocationInput;
  mapsUrl: string | null;
};

function formatLocationLine(location: SosLocationInput, mapsUrl: string | null): string {
  if (location.latitude == null || location.longitude == null) {
    return "Location: unavailable";
  }

  const accuracy =
    location.accuracy != null ? ` (±${Math.round(location.accuracy)}m)` : "";
  const coords = `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}${accuracy}`;
  return mapsUrl ? `Location: ${coords}\nMap: ${mapsUrl}` : `Location: ${coords}`;
}

export function buildSosEmergencyMessage(input: BuildMessageInput): string {
  const lines = [
    "SOS ALERT - Life Guardian",
    `${input.senderName} needs emergency help.`,
  ];

  if (input.message) {
    lines.push(`Message: ${input.message}`);
  }

  lines.push(formatLocationLine(input.location, input.mapsUrl));
  lines.push("Please respond immediately.");

  return lines.join("\n");
}

function stripPlusForWhatsApp(phone: string): string {
  return phone.replace(/^\+/, "");
}

function encodeMessage(text: string): string {
  return encodeURIComponent(text);
}

export function buildWhatsAppUrl(phone: string, message: string): string {
  const digits = stripPlusForWhatsApp(phone);
  return `https://wa.me/${digits}?text=${encodeMessage(message)}`;
}

export function buildSmsUrl(phone: string, message: string): string {
  const normalized = phone.replace(/\s/g, "");
  return `sms:${normalized}?body=${encodeMessage(message)}`;
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
