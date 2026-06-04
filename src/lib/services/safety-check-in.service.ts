import { prisma } from "@/lib/db/prisma";
import { ACTIVITY_EVENT_KIND } from "@/types/activity-log";
import {
  SAFETY_CHECK_IN_LABELS,
  type SafetyCheckInStatus,
} from "@/types/safety-check-in";
import { logUserActivity } from "@/lib/services/activity-log.service";

export async function createSafetyCheckIn(input: {
  userId: string;
  status: SafetyCheckInStatus;
  note?: string | null;
}) {
  const checkIn = await prisma.safetyCheckIn.create({
    data: {
      userId: input.userId,
      status: input.status,
      note: input.note?.trim() || null,
    },
  });

  await logUserActivity({
    userId: input.userId,
    eventKind: ACTIVITY_EVENT_KIND.CHECK_IN_CREATED,
    title: "Safety Check-In",
    description: `${SAFETY_CHECK_IN_LABELS[input.status]}${input.note ? `: ${input.note}` : ""}`,
  });

  return checkIn;
}

export async function getLatestSafetyCheckIn(userId: string) {
  return prisma.safetyCheckIn.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getRecentSafetyCheckIns(userId: string, take = 10) {
  return prisma.safetyCheckIn.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take,
  });
}
