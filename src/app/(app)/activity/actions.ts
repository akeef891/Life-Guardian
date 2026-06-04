"use server";

import { revalidatePath } from "next/cache";
import { getOrCreateCurrentUserWithProfile } from "@/lib/auth/user-context";
import { ROUTES } from "@/lib/constants/routes";
import { logUserActivity } from "@/lib/services/activity-log.service";
import { ACTIVITY_EVENT_KIND, type ActivityEventKind } from "@/types/activity-log";

const ALLOWED_KINDS: ActivityEventKind[] = [
  ACTIVITY_EVENT_KIND.RESOURCE_OPENED,
  ACTIVITY_EVENT_KIND.COMMUNITY_ALERT_VIEWED,
];

export async function logActivityEvent(
  eventKind: ActivityEventKind,
  title: string,
  description?: string,
): Promise<{ success: boolean }> {
  if (!ALLOWED_KINDS.includes(eventKind)) {
    return { success: false };
  }

  try {
    const { id: userId } = await getOrCreateCurrentUserWithProfile();
    await logUserActivity({ userId, eventKind, title, description });
    revalidatePath(ROUTES.dashboard);
    return { success: true };
  } catch {
    return { success: false };
  }
}
