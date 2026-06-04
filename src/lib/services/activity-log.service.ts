import { prisma } from "@/lib/db/prisma";
import type { ActivityEventKind } from "@/types/activity-log";

export async function logUserActivity(input: {
  userId: string;
  eventKind: ActivityEventKind;
  title: string;
  description?: string | null;
}) {
  return prisma.userActivityLog.create({
    data: {
      userId: input.userId,
      eventKind: input.eventKind,
      title: input.title,
      description: input.description ?? null,
    },
  });
}

export async function getRecentActivityLogs(userId: string, take = 20) {
  return prisma.userActivityLog.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take,
  });
}
