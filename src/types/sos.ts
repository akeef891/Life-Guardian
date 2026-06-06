import type { EmergencyContactRecord } from "@/lib/db/prisma-types";

export const SOS_STATUS_ACTIVE = "ACTIVE" as const;

export const SOS_DELIVERY_STATUS = {
  PENDING: "PENDING",
  PREPARED: "PREPARED",
  NO_CONTACTS: "NO_CONTACTS",
  FAILED: "FAILED",
} as const;

export type SosDeliveryStatus =
  (typeof SOS_DELIVERY_STATUS)[keyof typeof SOS_DELIVERY_STATUS];

export type SosLocationInput = {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  capturedAt: Date | null;
};

export type CreateSosAlertInput = {
  userId: string;
  message: string | null;
  location: SosLocationInput;
  contacts: EmergencyContactRecord[];
  senderName: string;
  clientTimeZone?: string | null;
};

export type ContactDeliveryPayload = {
  contactId: string;
  contactName: string;
  phone: string;
  whatsAppUrl: string;
  smsUrl: string;
  responseUrl: string;
};

export type SosConfirmationDto = {
  alertId: string;
  contactsNotified: number;
  locationLabel: string;
  mapsUrl: string | null;
  latitude: number | null;
  longitude: number | null;
  locationAccuracy: number | null;
  sentAt: string;
  deliveryStatus: SosDeliveryStatus;
  deliveryLinks: ContactDeliveryPayload[];
};

export type TriggerSosState = {
  success: boolean;
  message?: string;
  error?: string;
  confirmation?: SosConfirmationDto;
};

/** Runtime-safe initial state for useActionState (avoids referencing types at runtime). */
export const TRIGGER_SOS_INITIAL_STATE: TriggerSosState = {
  success: false,
};
