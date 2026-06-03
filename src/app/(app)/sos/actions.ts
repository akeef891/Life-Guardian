"use server";

import { revalidatePath } from "next/cache";
import { getOrCreateCurrentUserWithProfile } from "@/lib/auth/user-context";
import { ROUTES } from "@/lib/constants/routes";
import {
  createSosAlertWithDelivery,
  isValidSosCoordinates,
  parseSosLocationFromForm,
  resolveSenderName,
} from "@/lib/services/sos-alert.service";
import type { TriggerSosState } from "@/types/sos";

function toNullable(value: FormDataEntryValue | null): string | null {
  if (typeof value !== "string") {
    return null;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export async function triggerSOSAction(
  _prevState: TriggerSosState,
  formData: FormData,
): Promise<TriggerSosState> {
  try {
    const { id: userId, firstName, email, profile } = await getOrCreateCurrentUserWithProfile();
    const contacts = profile?.contacts ?? [];
    const message = toNullable(formData.get("message"));
    const location = parseSosLocationFromForm(formData);

    if (!isValidSosCoordinates(location)) {
      return {
        success: false,
        error: "Invalid location coordinates received.",
      };
    }

    const senderName = resolveSenderName(profile?.displayName, firstName, email);

    const confirmation = await createSosAlertWithDelivery({
      userId,
      message,
      location,
      contacts,
      senderName,
    });

    revalidatePath(ROUTES.sos);
    revalidatePath(ROUTES.dashboard);

    return {
      success: true,
      message: "SOS alert has been activated successfully.",
      confirmation,
    };
  } catch {
    return {
      success: false,
      error: "Unable to trigger SOS at the moment. Please try again.",
    };
  }
}

export type { TriggerSosState } from "@/types/sos";
