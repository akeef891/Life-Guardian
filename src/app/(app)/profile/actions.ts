"use server";

import { revalidatePath } from "next/cache";
import { ROUTES } from "@/lib/constants/routes";
import { getOrCreateCurrentUserWithProfile } from "@/lib/auth/user-context";
import { prisma } from "@/lib/db/prisma";
import { logServerError } from "@/lib/logging/server-error";
import type { SaveProfileState } from "./types";

function toNullable(value: FormDataEntryValue | null) {
  if (typeof value !== "string") {
    return null;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function parseDate(value: string | null) {
  if (!value) {
    return null;
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }
  return parsed;
}

export async function saveEmergencyProfile(
  _prevState: SaveProfileState,
  formData: FormData,
): Promise<SaveProfileState> {
  try {
    const user = await getOrCreateCurrentUserWithProfile();

    const payload = {
      displayName: toNullable(formData.get("displayName")),
      dateOfBirth: parseDate(toNullable(formData.get("dateOfBirth"))),
      bloodType: toNullable(formData.get("bloodType")),
      allergies: toNullable(formData.get("allergies")),
      medications: toNullable(formData.get("medications")),
      medicalConditions: toNullable(formData.get("medicalConditions")),
      notes: toNullable(formData.get("notes")),
      primaryLanguage: toNullable(formData.get("primaryLanguage")),
    };

    await prisma.emergencyProfile.upsert({
      where: { userId: user.id },
      update: payload,
      create: {
        userId: user.id,
        ...payload,
      },
    });

    revalidatePath(ROUTES.profile);

    return {
      success: true,
      message: "Profile saved successfully.",
    };
  } catch (error) {
    logServerError("saveEmergencyProfile", error);
    return {
      success: false,
      error: "Failed to save profile. Please try again.",
    };
  }
}
