"use server";

import { revalidatePath } from "next/cache";
import { getOrCreateCurrentUserWithProfile } from "@/lib/auth/user-context";
import { ROUTES } from "@/lib/constants/routes";
import { logServerError } from "@/lib/logging/server-error";
import {
  createSosAlertWithDelivery,
  isValidSosCoordinates,
  parseClientTimeZoneFromForm,
  parseSosLocationFromForm,
  resolveSenderName,
} from "@/lib/services/sos-alert.service";
import {
  checkSosRateLimit,
  findDuplicateSosConfirmation,
} from "@/lib/services/sos-guard.service";
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

    const duplicate = await findDuplicateSosConfirmation(userId, {
      senderName,
      message,
      location,
      contacts,
    });
    if (duplicate) {
      revalidatePath(ROUTES.sos);
      revalidatePath(ROUTES.dashboard);
      return {
        success: true,
        message: "SOS alert is already active.",
        confirmation: duplicate,
      };
    }

    const rateLimit = await checkSosRateLimit(userId);
    if (!rateLimit.allowed) {
      const waitHint =
        rateLimit.retryAfterSeconds > 0
          ? ` Try again in ${rateLimit.retryAfterSeconds} seconds.`
          : "";
      return {
        success: false,
        error: `${rateLimit.error}${waitHint}`,
      };
    }

    const confirmation = await createSosAlertWithDelivery({
      userId,
      message,
      location,
      contacts,
      senderName,
      clientTimeZone: parseClientTimeZoneFromForm(formData),
    });

    revalidatePath(ROUTES.sos);
    revalidatePath(ROUTES.dashboard);

    return {
      success: true,
      message: "SOS triggered successfully.",
      confirmation,
    };
  } catch (error) {
    logServerError("triggerSOSAction", error);
    return {
      success: false,
      error: "Failed to trigger SOS. Please check your connection and try again.",
    };
  }
}
