import { prisma } from "@/lib/prisma";

export type ItemCreateData = {
  name: string;
  description: string;
  price: number;
};

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

  addItemToWishlist: (wishlistId: string, item: ItemCreateData) =>
    prisma.wishlistItem.create({ data: { ...item, wishlistId } }),
};
