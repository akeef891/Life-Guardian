import { prisma } from "@/lib/db/prisma";

export type PublicEmergencyContact = {
  id: string;
  name: string;
  relationship: string | null;
  phone: string;
  isPrimary: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type PublicEmergencyProfile = {
  id: string;
  displayName: string | null;
  bloodType: string | null;
  allergies: string | null;
  medications: string | null;
  medicalConditions: string | null;
  notes: string | null;
  contacts: PublicEmergencyContact[];
};

export async function getPublicEmergencyProfileByToken(
  token: string,
): Promise<PublicEmergencyProfile | null> {
  return prisma.emergencyProfile.findUnique({
    where: { qrToken: token },
    select: {
      id: true,
      displayName: true,
      bloodType: true,
      allergies: true,
      medications: true,
      medicalConditions: true,
      notes: true,
      contacts: {
        select: {
          id: true,
          name: true,
          relationship: true,
          phone: true,
          isPrimary: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: [{ isPrimary: "desc" }, { createdAt: "asc" }],
      },
    },
  });
}
