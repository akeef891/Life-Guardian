"use server";

import { revalidatePath } from "next/cache";
import type { PrismaClient } from "@prisma/client";
import { getOrCreateCurrentUserWithProfile } from "@/lib/auth/user-context";
import { ROUTES } from "@/lib/constants/routes";
import { prisma } from "@/lib/db/prisma";

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
  PrismaClient,
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

export async function createEmergencyContact(formData: FormData): Promise<void> {
  const profileId = await getOwnedProfileId();
  if (!profileId) {
    return;
  }
  const { name, relationship, phoneInput, isPrimary } = readContactFormValues(formData);

  if (!name || !phoneInput) {
    return;
  }

  const phone = normalizePhone(phoneInput);
  if (!validatePhone(phone)) {
    return;
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
}

export async function updateEmergencyContact(formData: FormData): Promise<void> {
  const profileId = await getOwnedProfileId();
  if (!profileId) {
    return;
  }
  const { contactId, name, relationship, phoneInput, isPrimary } = readContactFormValues(formData);

  if (!contactId || !name || !phoneInput) {
    return;
  }

  const phone = normalizePhone(phoneInput);
  if (!validatePhone(phone)) {
    return;
  }

  await prisma.$transaction(async (tx: TransactionClient) => {
    const existing: ContactIdSelection | null = await tx.emergencyContact.findFirst({
      where: { id: contactId, profileId },
      select: { id: true },
    });

    if (!existing) {
      return;
    }

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
}

export async function deleteEmergencyContact(formData: FormData): Promise<void> {
  const profileId = await getOwnedProfileId();
  if (!profileId) {
    return;
  }
  const { contactId } = readContactFormValues(formData);
  if (!contactId) {
    return;
  }

  await prisma.$transaction(async (tx: TransactionClient) => {
    const existing: ContactPrimarySelection | null = await tx.emergencyContact.findFirst({
      where: { id: contactId, profileId },
      select: { id: true, isPrimary: true },
    });

    if (!existing) {
      return;
    }

    await tx.emergencyContact.delete({
      where: { id: contactId },
    });

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
}
