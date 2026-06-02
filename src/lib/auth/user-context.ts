import { auth, currentUser } from "@clerk/nextjs/server";
import type { EmergencyContact, EmergencyProfile, User } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";

export type UserWithProfile = Omit<User, "profile"> & {
  profile: (EmergencyProfile & { contacts: EmergencyContact[] }) | null;
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
