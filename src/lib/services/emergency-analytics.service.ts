import { prisma } from "@/lib/db/prisma";
import {
  CONTACT_RESPONSE_STATUS,
  SOS_ESCALATION_STATUS,
} from "@/types/emergency-response";

export type EmergencyAnalytics = {
  totalSos: number;
  responsesReceived: number;
  escalations: number;
  averageResponseTimeMinutes: number | null;
  readinessTrendLabel: string;
  readinessTrendDirection: "up" | "down" | "stable";
};

function averageResponseMinutes(
  rows: Array<{ respondedAt: Date | null; createdAt: Date }>,
): number | null {
  const deltas: number[] = [];
  for (const row of rows) {
    if (!row.respondedAt) {
      continue;
    }
    const ms = row.respondedAt.getTime() - row.createdAt.getTime();
    if (ms > 0) {
      deltas.push(ms);
    }
  }
  if (deltas.length === 0) {
    return null;
  }
  const avgMs = deltas.reduce((a, b) => a + b, 0) / deltas.length;
  return Math.round((avgMs / 60_000) * 10) / 10;
}

export async function getEmergencyAnalytics(
  userId: string,
  currentReadinessScore: number,
): Promise<EmergencyAnalytics> {
  const [totalSos, escalations, responseRows, recentAlerts] = await Promise.all([
    prisma.sOSAlert.count({ where: { userId } }),
    prisma.sOSAlert.count({
      where: { userId, escalationStatus: SOS_ESCALATION_STATUS.ESCALATED },
    }),
    prisma.sOSContactResponse.findMany({
      where: {
        sosAlert: { userId },
        status: { not: CONTACT_RESPONSE_STATUS.PENDING },
      },
      select: {
        respondedAt: true,
        createdAt: true,
        sosAlert: { select: { createdAt: true } },
      },
    }),
    prisma.sOSAlert.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 14,
      select: { createdAt: true },
    }),
  ]);

  const responsesReceived = responseRows.length;

  const avgRows = responseRows.map((r) => ({
    respondedAt: r.respondedAt,
    createdAt: r.sosAlert.createdAt,
  }));

  const now = Date.now();
  const weekMs = 7 * 24 * 60 * 60 * 1000;
  const last7 = recentAlerts.filter((a) => now - a.createdAt.getTime() <= weekMs).length;
  const prev7 = recentAlerts.filter((a) => {
    const age = now - a.createdAt.getTime();
    return age > weekMs && age <= weekMs * 2;
  }).length;

  let readinessTrendDirection: EmergencyAnalytics["readinessTrendDirection"] = "stable";
  let readinessTrendLabel = "Steady readiness";

  if (currentReadinessScore >= 80) {
    readinessTrendLabel = "Emergency ready";
    readinessTrendDirection = "up";
  } else if (last7 > prev7) {
    readinessTrendLabel = "More drills this week";
    readinessTrendDirection = "up";
  } else if (last7 < prev7 && prev7 > 0) {
    readinessTrendLabel = "Fewer alerts this week";
    readinessTrendDirection = "down";
  } else if (currentReadinessScore < 50) {
    readinessTrendLabel = "Needs attention";
    readinessTrendDirection = "down";
  }

  return {
    totalSos,
    responsesReceived,
    escalations,
    averageResponseTimeMinutes: averageResponseMinutes(avgRows),
    readinessTrendLabel,
    readinessTrendDirection,
  };
}
