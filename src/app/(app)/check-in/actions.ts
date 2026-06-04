"use server";

import { revalidatePath } from "next/cache";
import { getOrCreateCurrentUserWithProfile } from "@/lib/auth/user-context";
import { ROUTES } from "@/lib/constants/routes";
import { createSafetyCheckIn } from "@/lib/services/safety-check-in.service";
import {
  SAFETY_CHECK_IN_STATUS,
  type SafetyCheckInStatus,
} from "@/types/safety-check-in";
import type { CheckInActionState } from "./types";

function isValidStatus(value: string): value is SafetyCheckInStatus {
  return Object.values(SAFETY_CHECK_IN_STATUS).includes(value as SafetyCheckInStatus);
}

export async function submitSafetyCheckIn(
  _prev: CheckInActionState,
  formData: FormData,
): Promise<CheckInActionState> {
  try {
    const { id: userId } = await getOrCreateCurrentUserWithProfile();
    const statusRaw = formData.get("status");
    const note = formData.get("note");

    if (typeof statusRaw !== "string" || !isValidStatus(statusRaw)) {
      return { success: false, error: "Invalid check-in status." };
    }

    await createSafetyCheckIn({
      userId,
      status: statusRaw,
      note: typeof note === "string" ? note : null,
    });

    revalidatePath(ROUTES.checkIn);
    revalidatePath(ROUTES.dashboard);

    return { success: true, message: "Check-in recorded successfully." };
  } catch {
    return { success: false, error: "Unable to save check-in. Please try again." };
  }
}
