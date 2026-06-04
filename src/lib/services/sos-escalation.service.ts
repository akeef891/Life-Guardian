import { prisma } from "@/lib/db/prisma";
import {
  CONTACT_RESPONSE_STATUS,
  SOS_ESCALATION_AFTER_MS,
  SOS_ESCALATION_STATUS,
} from "@/types/emergency-response";

export async function processPendingEscalations(userId: string): Promise<number> {
  const now = Date.now();
  const alerts = await prisma.sOSAlert.findMany({
    where: {
      userId,
      status: "ACTIVE",
      escalationStatus: SOS_ESCALATION_STATUS.NONE,
      closedAt: null,
    },
    include: {
      responses: { select: { status: true } },
    },
  });

  let escalated = 0;

  for (const alert of alerts) {
    const elapsed = now - alert.createdAt.getTime();
    if (elapsed < SOS_ESCALATION_AFTER_MS) {
      continue;
    }

    const hasNonPending = alert.responses.some(
      (r) => r.status !== CONTACT_RESPONSE_STATUS.PENDING,
    );
    if (hasNonPending) {
      continue;
    }

    await prisma.sOSAlert.update({
      where: { id: alert.id },
      data: {
        escalationStatus: SOS_ESCALATION_STATUS.ESCALATED,
        escalatedAt: new Date(),
      },
    });
    escalated += 1;
  }

  return escalated;
}
