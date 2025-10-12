import { prisma } from "@/lib/prisma";

export type ProfileFormData = {
  name: string;
  birthDate: string;
  userId: string;
  avatarId: string;
  isMainProfile: boolean;
};

export const profileRepository = {
  findByUserId: (userId: string) =>
    prisma.profile.findMany({
      where: { userId },
      orderBy: { id: "asc" },
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

  createProfile: (profile: ProfileFormData) =>
    prisma.profile.create({ data: profile }),
};
