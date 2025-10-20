import { prisma } from "@/lib/prisma";

export const wishlistRepository = {
  findByUser: (userId: string) =>
    prisma.wishlist.findMany({
      where: { userId },
      include: {
        items: true,
        profile: {
          include: {
            avatar: true,
          },
        },
      },
    }),

  findById: (id: string) =>
    prisma.wishlist.findUnique({
      where: { id },
      include: {
        items: true,
        profile: {
          include: {
            avatar: true,
          },
        },
      },
    }),
};
