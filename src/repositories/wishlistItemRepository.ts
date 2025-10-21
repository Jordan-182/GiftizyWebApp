import { prisma } from "@/lib/prisma";
import type { CreateWishlistItemInput } from "@/schemas";

// Utilisation du type généré par Zod
export type ItemCreateData = CreateWishlistItemInput;

export const wishlistItemRepository = {
  deleteItem: (id: string) =>
    prisma.wishlistItem.delete({
      where: { id },
    }),

  getItemWithWishlist: (id: string) =>
    prisma.wishlistItem.findUnique({
      where: { id },
      include: {
        wishlist: {
          select: { userId: true },
        },
      },
    }),

  getWishlistWithUser: (id: string) =>
    prisma.wishlist.findUnique({
      where: { id },
      select: {
        id: true,
        userId: true,
        name: true,
      },
    }),

  addItemToWishlist: (wishlistId: string, item: ItemCreateData) =>
    prisma.wishlistItem.create({ data: { ...item, wishlistId } }),
};
