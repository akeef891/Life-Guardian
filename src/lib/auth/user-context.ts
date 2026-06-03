import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db/prisma";
import {
  userWithProfileInclude,
  type UserWithProfile,
} from "@/lib/db/prisma-types";

export type { EmergencyContactRecord, EmergencyProfileWithContacts, UserWithProfile } from "@/lib/db/prisma-types";

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
    include: userWithProfileInclude,
  });

  if (user.profile) {
    return user;
  }

  const profile = await prisma.emergencyProfile.create({
    data: { userId: user.id },
    include: {
      contacts: {
        orderBy: [{ isPrimary: "desc" as const }, { createdAt: "asc" as const }],
      },
    },
  });

  return {
    ...user,
    profile,
  };
}
