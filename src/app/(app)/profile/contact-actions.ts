"use server";

import { revalidatePath } from "next/cache";
import { getOrCreateCurrentUserWithProfile } from "@/lib/auth/user-context";
import { ROUTES } from "@/lib/constants/routes";
import { prisma } from "@/lib/db/prisma";
import { logServerError } from "@/lib/logging/server-error";
import type { ContactActionState } from "./types";

type Id = string;

type ContactFormValues = {
  contactId: Id | null;
  name: string | null;
  relationship: string | null;
  phoneInput: string | null;
  isPrimary: boolean;
};

type ContactIdSelection = { id: Id };
type ContactPrimarySelection = { id: Id; isPrimary: boolean };
type TransactionClient = Omit<
  typeof prisma,
  "$connect" | "$disconnect" | "$on" | "$use" | "$extends"
>;

function toNullable(value: FormDataEntryValue | null): string | null {
  if (typeof value !== "string") {
    return null;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function normalizePhone(value: string): string {
  return value.replace(/[\s()-]/g, "");
}

function validatePhone(value: string): boolean {
  // E.164-like validation: + and 8-15 digits total.
  return /^\+[1-9]\d{7,14}$/.test(value);
}

function readContactFormValues(formData: FormData): ContactFormValues {
  return {
    contactId: toNullable(formData.get("contactId")),
    name: toNullable(formData.get("name")),
    relationship: toNullable(formData.get("relationship")),
    phoneInput: toNullable(formData.get("phone")),
    isPrimary: formData.get("isPrimary") === "on",
  };
}

async function getOwnedProfileId(): Promise<Id | null> {
  const { profile } = await getOrCreateCurrentUserWithProfile();
  if (!profile) {
    return null;
  }
  return profile.id;
}

export async function createEmergencyContact(
  _prev: ContactActionState,
  formData: FormData,
): Promise<ContactActionState> {
  try {
  const profileId = await getOwnedProfileId();
  if (!profileId) {
    return { success: false, error: "Profile not found." };
  }
  const { name, relationship, phoneInput, isPrimary } = readContactFormValues(formData);

  if (!name || !phoneInput) {
    return { success: false, error: "Name and phone are required." };
  }

  const phone = normalizePhone(phoneInput);
  if (!validatePhone(phone)) {
    return { success: false, error: "Use international phone format, e.g. +15551234567." };
  }

  await prisma.$transaction(async (tx: TransactionClient) => {
    if (isPrimary) {
      await tx.emergencyContact.updateMany({
        where: { profileId },
        data: { isPrimary: false },
      });
    }

    const hasPrimary: ContactIdSelection | null = await tx.emergencyContact.findFirst({
      where: { profileId, isPrimary: true },
      select: { id: true },
    });

    await tx.emergencyContact.create({
      data: {
        profileId,
        name,
        relationship,
        phone,
        isPrimary: isPrimary || !hasPrimary,
      },
    });
  });

  revalidatePath(ROUTES.profile);
  revalidatePath(ROUTES.dashboard);
  return { success: true, message: "Contact added successfully." };
  } catch (error) {
    logServerError("createEmergencyContact", error);
    return { success: false, error: "Failed to add contact. Please try again." };
  }
}

export async function updateEmergencyContact(
  _prev: ContactActionState,
  formData: FormData,
): Promise<ContactActionState> {
  try {
  const profileId = await getOwnedProfileId();
  if (!profileId) {
    return { success: false, error: "Profile not found." };
  }
  const { contactId, name, relationship, phoneInput, isPrimary } = readContactFormValues(formData);

  if (!contactId || !name || !phoneInput) {
    return { success: false, error: "Name and phone are required." };
  }

  const phone = normalizePhone(phoneInput);
  if (!validatePhone(phone)) {
    return { success: false, error: "Use international phone format, e.g. +15551234567." };
  }

  const owned = await prisma.emergencyContact.findFirst({
    where: { id: contactId, profileId },
    select: { id: true },
  });
  if (!owned) {
    return { success: false, error: "Contact not found." };
  }

  await prisma.$transaction(async (tx: TransactionClient) => {
    if (isPrimary) {
      await tx.emergencyContact.updateMany({
        where: { profileId },
        data: { isPrimary: false },
      });
    }

    await tx.emergencyContact.update({
      where: { id: contactId },
      data: {
        name,
        relationship,
        phone,
        isPrimary,
      },
    });

    const hasPrimary: ContactIdSelection | null = await tx.emergencyContact.findFirst({
      where: { profileId, isPrimary: true },
      select: { id: true },
    });

    if (!hasPrimary) {
      const first: ContactIdSelection | null = await tx.emergencyContact.findFirst({
        where: { profileId },
        orderBy: { createdAt: "asc" },
        select: { id: true },
      });
      if (first) {
        await tx.emergencyContact.update({
          where: { id: first.id },
          data: { isPrimary: true },
        });
      }
    }
  });

  revalidatePath(ROUTES.profile);
  revalidatePath(ROUTES.dashboard);
  return { success: true, message: "Contact updated successfully." };
  } catch (error) {
    logServerError("updateEmergencyContact", error);
    return { success: false, error: "Failed to update contact. Please try again." };
  }
}

export async function deleteEmergencyContact(
  _prev: ContactActionState,
  formData: FormData,
): Promise<ContactActionState> {
  try {
  const profileId = await getOwnedProfileId();
  if (!profileId) {
    return { success: false, error: "Profile not found." };
  }
  const { contactId } = readContactFormValues(formData);
  if (!contactId) {
    return { success: false, error: "Contact not found." };
  }

  const existing: ContactPrimarySelection | null = await prisma.emergencyContact.findFirst({
    where: { id: contactId, profileId },
    select: { id: true, isPrimary: true },
  });
  if (!existing) {
    return { success: false, error: "Contact not found." };
  }

  await prisma.$transaction(async (tx: TransactionClient) => {
    await tx.emergencyContact.delete({ where: { id: contactId } });

    if (existing.isPrimary) {
      const next: ContactIdSelection | null = await tx.emergencyContact.findFirst({
        where: { profileId },
        orderBy: { createdAt: "asc" },
        select: { id: true },
      });
      if (next) {
        await tx.emergencyContact.update({
          where: { id: next.id },
          data: { isPrimary: true },
        });
      }
    }
  });

  revalidatePath(ROUTES.profile);
  revalidatePath(ROUTES.dashboard);
  return { success: true, message: "Contact deleted successfully." };
  } catch (error) {
    logServerError("deleteEmergencyContact", error);
    return { success: false, error: "Failed to delete contact. Please try again." };
  }
}
