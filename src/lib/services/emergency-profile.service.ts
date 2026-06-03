import { prisma } from "@/lib/db/prisma";
import {
  publicEmergencyProfileSelect,
  type PublicEmergencyProfile,
} from "@/lib/db/prisma-types";

export type { PublicEmergencyContact, PublicEmergencyProfile } from "@/lib/db/prisma-types";

export async function getPublicEmergencyProfileByToken(
  token: string,
): Promise<PublicEmergencyProfile | null> {
  return prisma.emergencyProfile.findUnique({
    where: { qrToken: token },
    select: publicEmergencyProfileSelect,
  });
}
