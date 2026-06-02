import { prisma } from "@/lib/db/prisma";

export async function getPublicEmergencyProfileByToken(token: string) {
  return prisma.emergencyProfile.findUnique({
    where: { qrToken: token },
    include: {
      contacts: {
        orderBy: [{ isPrimary: "desc" }, { createdAt: "asc" }],
      },
    },
  });
}
