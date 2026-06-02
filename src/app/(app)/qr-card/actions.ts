"use server";

import { revalidatePath } from "next/cache";
import { getOrCreateCurrentUserWithProfile } from "@/lib/auth/user-context";
import { ROUTES } from "@/lib/constants/routes";
import { prisma } from "@/lib/db/prisma";
import { generateQrToken } from "@/lib/utils/tokens";

export type GenerateQrState = {
  success: boolean;
  message?: string;
  token?: string;
  error?: string;
};

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
      message: profile?.qrToken
        ? "QR token regenerated successfully."
        : "QR token generated successfully.",
    };
  } catch {
    return {
      success: false,
      error: "Unable to generate QR token right now. Please try again.",
    };
  }
}
