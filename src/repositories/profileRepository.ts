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

  editProfile: (id: string, updatedProfile: ProfileCreateData) =>
    prisma.profile.update({
      where: { id },
      data: updatedProfile,
    }),
};
