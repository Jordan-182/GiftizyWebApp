import { prisma } from "@/lib/prisma";

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
};
