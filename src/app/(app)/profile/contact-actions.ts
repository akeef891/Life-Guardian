"use server";

import { revalidatePath } from "next/cache";
import { getOrCreateCurrentUserWithProfile } from "@/lib/auth/user-context";
import { ROUTES } from "@/lib/constants/routes";
import { prisma } from "@/lib/db/prisma";

function toNullable(value: FormDataEntryValue | null) {
  if (typeof value !== "string") {
    return null;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function normalizePhone(value: string) {
  return value.replace(/[\s()-]/g, "");
}

function validatePhone(value: string) {
  // E.164-like validation: + and 8-15 digits total.
  return /^\+[1-9]\d{7,14}$/.test(value);
}

async function getOwnedProfileId() {
  const { profile } = await getOrCreateCurrentUserWithProfile();
  if (!profile) {
    return null;
  }
  return profile.id;
}

export async function createEmergencyContact(formData: FormData) {
  const profileId = await getOwnedProfileId();
  if (!profileId) {
    return;
  }
  const name = toNullable(formData.get("name"));
  const relationship = toNullable(formData.get("relationship"));
  const phoneInput = toNullable(formData.get("phone"));
  const isPrimary = formData.get("isPrimary") === "on";

  if (!name || !phoneInput) {
    return;
  }

  const phone = normalizePhone(phoneInput);
  if (!validatePhone(phone)) {
    return;
  }

  await prisma.$transaction(async (tx) => {
    if (isPrimary) {
      await tx.emergencyContact.updateMany({
        where: { profileId },
        data: { isPrimary: false },
      });
    }

    const hasPrimary = await tx.emergencyContact.findFirst({
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

export async function updateEmergencyContact(formData: FormData) {
  const profileId = await getOwnedProfileId();
  if (!profileId) {
    return;
  }
  const contactId = toNullable(formData.get("contactId"));
  const name = toNullable(formData.get("name"));
  const relationship = toNullable(formData.get("relationship"));
  const phoneInput = toNullable(formData.get("phone"));
  const isPrimary = formData.get("isPrimary") === "on";

  if (!contactId || !name || !phoneInput) {
    return;
  }

  const phone = normalizePhone(phoneInput);
  if (!validatePhone(phone)) {
    return;
  }

  await prisma.$transaction(async (tx) => {
    const existing = await tx.emergencyContact.findFirst({
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

    const hasPrimary = await tx.emergencyContact.findFirst({
      where: { profileId, isPrimary: true },
      select: { id: true },
    });

    if (!hasPrimary) {
      const first = await tx.emergencyContact.findFirst({
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

export async function deleteEmergencyContact(formData: FormData) {
  const profileId = await getOwnedProfileId();
  if (!profileId) {
    return;
  }
  const contactId = toNullable(formData.get("contactId"));
  if (!contactId) {
    return;
  }

  await prisma.$transaction(async (tx) => {
    const existing = await tx.emergencyContact.findFirst({
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
      const next = await tx.emergencyContact.findFirst({
        where: { profileId },
        orderBy: { createdAt: "asc" },
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
