import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db/prisma";

type EmergencyContactRecord = {
  id: string;
  profileId: string;
  name: string;
  relationship: string | null;
  phone: string;
  isPrimary: boolean;
  createdAt: Date;
  updatedAt: Date;
};

type EmergencyProfileRecord = {
  id: string;
  userId: string;
  qrToken: string | null;
  displayName: string | null;
  dateOfBirth: Date | null;
  bloodType: string | null;
  allergies: string | null;
  medications: string | null;
  medicalConditions: string | null;
  notes: string | null;
  primaryLanguage: string | null;
  createdAt: Date;
  updatedAt: Date;
  contacts: EmergencyContactRecord[];
};

type UserRecord = {
  id: string;
  clerkUserId: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type UserWithProfile = UserRecord & {
  profile: EmergencyProfileRecord | null;
};

export async function getOrCreateCurrentUserWithProfile(): Promise<UserWithProfile> {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const clerkUser = await currentUser();

  const email = clerkUser?.emailAddresses[0]?.emailAddress;
  if (!email) {
    throw new Error("Authenticated user has no email address.");
  }

  const user = await prisma.user.upsert({
    where: { clerkUserId: userId },
    update: {
      email,
      firstName: clerkUser?.firstName ?? null,
      lastName: clerkUser?.lastName ?? null,
    },
    create: {
      clerkUserId: userId,
      email,
      firstName: clerkUser?.firstName ?? null,
      lastName: clerkUser?.lastName ?? null,
      profile: {
        create: {},
      },
    },
    include: {
      profile: {
        include: {
          contacts: {
            orderBy: [{ isPrimary: "desc" }, { createdAt: "asc" }],
          },
        },
      },
    },
  });

  if (user.profile) {
    return user;
  }

  const profile = await prisma.emergencyProfile.create({
    data: { userId: user.id },
    include: {
      contacts: {
        orderBy: [{ isPrimary: "desc" }, { createdAt: "asc" }],
      },
    },
  });

  return {
    ...user,
    profile,
  };
}
