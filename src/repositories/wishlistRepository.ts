import { prisma } from "@/lib/prisma";
import type { CreateWishlistInput } from "@/schemas/wishlist.schema";

export const wishlistRepository = {
  create: (data: CreateWishlistInput & { userId: string }) =>
    prisma.wishlist.create({
      data,
      include: {
        profile: {
          include: {
            avatar: true,
          },
        },
        items: true,
      },
    }),
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

  delete: (id: string) =>
    prisma.wishlist.delete({
      where: { id },
    }),

  findByIdWithUserId: (id: string, userId: string) =>
    prisma.wishlist.findFirst({
      where: {
        id,
        userId,
      },
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
