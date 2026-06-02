"use server";

import { revalidatePath } from "next/cache";
import { getOrCreateCurrentUserWithProfile } from "@/lib/auth/user-context";
import { ROUTES } from "@/lib/constants/routes";
import { prisma } from "@/lib/db/prisma";

export type TriggerSosState = {
  success: boolean;
  message?: string;
  error?: string;
};

function toNullable(value: FormDataEntryValue | null) {
  if (typeof value !== "string") {
    return null;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function parseNullableFloat(value: string | null) {
  if (!value) {
    return null;
  }
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export async function triggerSOSAction(
  _prevState: TriggerSosState,
  formData: FormData,
): Promise<TriggerSosState> {
  try {
    const { id: userId } = await getOrCreateCurrentUserWithProfile();

    const message = toNullable(formData.get("message"));
    const latitude = parseNullableFloat(toNullable(formData.get("latitude")));
    const longitude = parseNullableFloat(toNullable(formData.get("longitude")));

    await prisma.sOSAlert.create({
      data: {
        userId,
        message,
        status: "ACTIVE",
        latitude,
        longitude,
      },
    });

    revalidatePath(ROUTES.sos);
    revalidatePath(ROUTES.dashboard);

    return {
      success: true,
      message: "SOS alert has been created successfully.",
    };
  } catch {
    return {
      success: false,
      error: "Unable to trigger SOS at the moment. Please try again.",
    };
  }
}
