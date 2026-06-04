"use server";

import { revalidatePath } from "next/cache";
import { getOrCreateCurrentUserWithProfile } from "@/lib/auth/user-context";
import { ROUTES } from "@/lib/constants/routes";
import { prisma } from "@/lib/db/prisma";
import { logServerError } from "@/lib/logging/server-error";
import { generateQrToken } from "@/lib/utils/tokens";
import type { GenerateQrState } from "./types";

export async function generateQrTokenAction(
  _prev: GenerateQrState,
): Promise<GenerateQrState> {
  try {
    const { id, profile } = await getOrCreateCurrentUserWithProfile();

    const token = generateQrToken();

    await prisma.emergencyProfile.upsert({
      where: { userId: id },
      update: { qrToken: token },
      create: { userId: id, qrToken: token },
    });

    revalidatePath(ROUTES.qrCard);

    return {
      success: true,
      token,
      message: profile?.qrToken ? "QR regenerated successfully." : "QR generated successfully.",
    };
  } catch (error) {
    logServerError("generateQrTokenAction", error);
    return {
      success: false,
      error: "Failed to generate QR. Please try again.",
    };
  }
}
