"use server";

import { revalidatePath } from "next/cache";
import { getOrCreateCurrentUserWithProfile } from "@/lib/auth/user-context";
import { ROUTES } from "@/lib/constants/routes";
import { logServerError } from "@/lib/logging/server-error";
import { deleteSosAlertForUser } from "@/lib/services/sos-alert.service";

export type DeleteSosAlertState = {
  success: boolean;
  message?: string;
  error?: string;
};

export async function deleteSOSAlertAction(alertId: string): Promise<DeleteSosAlertState> {
  if (!alertId?.trim()) {
    return { success: false, error: "Invalid alert identifier." };
  }

  try {
    const { id: userId } = await getOrCreateCurrentUserWithProfile();
    const deleted = await deleteSosAlertForUser(userId, alertId);

    if (!deleted) {
      return {
        success: false,
        error: "This SOS alert could not be deleted or you do not have access.",
      };
    }

    revalidatePath(ROUTES.sos);
    revalidatePath(ROUTES.dashboard);

    return {
      success: true,
      message: "SOS alert deleted successfully.",
    };
  } catch (error) {
    logServerError("deleteSOSAlertAction", error);
    return {
      success: false,
      error: "Failed to delete SOS alert. Please try again.",
    };
  }
}
