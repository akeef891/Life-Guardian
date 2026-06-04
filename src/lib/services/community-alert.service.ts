import { prisma } from "@/lib/db/prisma";
import {
  COMMUNITY_ALERT_SEVERITY,
  type CommunityAlertDto,
  type CommunityAlertSeverity,
} from "@/types/community-alert";

const MOCK_COMMUNITY_ALERTS: Omit<CommunityAlertDto, "id" | "createdAt">[] = [
  {
    title: "Heatwave advisory",
    description:
      "High temperatures expected this week. Stay hydrated and avoid prolonged outdoor activity during peak hours.",
    severity: COMMUNITY_ALERT_SEVERITY.ADVISORY,
  },
  {
    title: "Road safety campaign",
    description:
      "Local authorities are running a night visibility campaign. Use reflective gear when walking or cycling after dark.",
    severity: COMMUNITY_ALERT_SEVERITY.INFO,
  },
  {
    title: "Flood-prone area notice",
    description:
      "Monitor weather alerts in low-lying areas. Keep emergency kits ready and identify nearest evacuation routes.",
    severity: COMMUNITY_ALERT_SEVERITY.WARNING,
  },
];

async function seedMockAlertsIfEmpty(): Promise<void> {
  const count = await prisma.communityAlert.count();
  if (count > 0) {
    return;
  }

  await prisma.communityAlert.createMany({
    data: MOCK_COMMUNITY_ALERTS.map((alert) => ({
      title: alert.title,
      description: alert.description,
      severity: alert.severity,
      createdAt: new Date(),
    })),
  });
}

function toDto(row: {
  id: string;
  title: string;
  description: string;
  severity: string;
  createdAt: Date;
}): CommunityAlertDto {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    severity: row.severity as CommunityAlertSeverity,
    createdAt: row.createdAt,
  };
}

/** Supports future admin panel via CommunityAlert table. */
export async function getCommunityAlerts(limit = 5): Promise<CommunityAlertDto[]> {
  await seedMockAlertsIfEmpty();

  const rows = await prisma.communityAlert.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return rows.map(toDto);
}

export async function getLatestCommunityAlert(): Promise<CommunityAlertDto | null> {
  const alerts = await getCommunityAlerts(1);
  return alerts[0] ?? null;
}
