"use server";

import { revalidatePath } from "next/cache";
import { ROUTES } from "@/lib/constants/routes";
import { updateContactResponseStatus } from "@/lib/services/sos-response.service";
import type { ContactResponseStatus } from "@/types/emergency-response";

export async function submitContactResponse(
  token: string,
  status: ContactResponseStatus,
): Promise<{ success: boolean; error?: string }> {
  const result = await updateContactResponseStatus(token, status);
  if (result.success) {
    revalidatePath(ROUTES.dashboard);
    revalidatePath(ROUTES.sos);
  }
  return result;
}
