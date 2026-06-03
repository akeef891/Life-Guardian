import type { Prisma } from "@prisma/client";

/** Select shape for the public emergency card page (`/emergency/[token]`). */
export const publicEmergencyProfileSelect = {
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
    orderBy: [{ isPrimary: "desc" as const }, { createdAt: "asc" as const }],
  },
} satisfies Prisma.EmergencyProfileSelect;

export type PublicEmergencyProfile = Prisma.EmergencyProfileGetPayload<{
  select: typeof publicEmergencyProfileSelect;
}>;

export type PublicEmergencyContact = PublicEmergencyProfile["contacts"][number];

/** Include shape for authenticated user + profile + contacts. */
export const userWithProfileInclude = {
  profile: {
    include: {
      contacts: {
        orderBy: [{ isPrimary: "desc" as const }, { createdAt: "asc" as const }],
      },
    },
  },
} satisfies Prisma.UserInclude;

export type UserWithProfilePayload = Prisma.UserGetPayload<{
  include: typeof userWithProfileInclude;
}>;

export type EmergencyProfileWithContacts = NonNullable<UserWithProfilePayload["profile"]>;

export type EmergencyContactRecord = EmergencyProfileWithContacts["contacts"][number];

export type UserWithProfile = Omit<UserWithProfilePayload, "profile"> & {
  profile: EmergencyProfileWithContacts | null;
};
