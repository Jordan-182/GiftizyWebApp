import { prisma } from "@/lib/prisma";

export const userRepository = {
  findById: (id: string) =>
    prisma.user.findUnique({
      where: { id },
      include: {
        accounts: {
          select: {
            providerId: true,
          },
        },
      },
    }),

  findByFriendCode: (friendCode: string) =>
    prisma.user.findUnique({
      where: { friendCode },
      include: {
        avatar: true,
      },
    }),
};
