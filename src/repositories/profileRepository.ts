import { prisma } from "@/lib/prisma";

export type ProfileFormData = {
  name: string;
  birthDate: string;
  friendCode: string;
  avatarId: string;
  isMainProfile: boolean;
};

export type ProfileCreateData = ProfileFormData & {
  userId: string;
};

// Types pour les Server Actions (avec Date au lieu de string)
export type ProfileActionData = {
  name: string;
  birthDate: Date | null;
  friendCode: string;
  avatarId: string | null;
  isMainProfile: boolean;
};

export type ProfileActionCreateData = ProfileActionData & {
  userId: string;
};

export const profileRepository = {
  findByfriendCode: (friendCode: string) =>
    prisma.profile.findMany({
      where: { friendCode },
      orderBy: { createdAt: "asc" },
      include: {
        avatar: {
          select: {
            url: true,
          },
        },
      },
    }),

  deleteProfile: (id: string) =>
    prisma.profile.delete({
      where: { id },
    }),

  createProfile: (profile: ProfileCreateData) =>
    prisma.profile.create({ data: profile }),

  // Méthode pour les Server Actions avec les bons types
  createProfileFromAction: (profile: ProfileActionCreateData) =>
    prisma.profile.create({ data: profile }),

  editProfile: (id: string, updatedProfile: ProfileCreateData) =>
    prisma.profile.update({
      where: { id },
      data: updatedProfile,
    }),

  // Méthode pour les Server Actions avec les bons types
  editProfileFromAction: (
    id: string,
    updatedProfile: ProfileActionData & { userId: string }
  ) =>
    prisma.profile.update({
      where: { id },
      data: updatedProfile,
    }),
};
