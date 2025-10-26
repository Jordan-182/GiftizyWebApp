import { prisma } from "@/lib/prisma";
import type {
  CreateWishlistInput,
  UpdateWishlistInput,
} from "@/schemas/wishlist.schema";

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
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
    }),
  findByUser: (userId: string) =>
    prisma.wishlist.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            reservation: {
              include: {
                reservedBy: {
                  select: {
                    id: true,
                    name: true,
                    avatar: true,
                  },
                },
              },
            },
          },
        },
        profile: {
          include: {
            avatar: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
    }),

  findById: (id: string) =>
    prisma.wishlist.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            reservation: {
              include: {
                reservedBy: {
                  select: {
                    id: true,
                    name: true,
                    avatar: true,
                  },
                },
              },
            },
          },
        },
        profile: {
          include: {
            avatar: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
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
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
    }),

  update: (id: string, data: UpdateWishlistInput) =>
    prisma.wishlist.update({
      where: { id },
      data,
      include: {
        items: true,
        profile: {
          include: {
            avatar: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
    }),

  findByFriends: (userId: string) =>
    prisma.wishlist.findMany({
      where: {
        user: {
          OR: [
            {
              sentFriendships: {
                some: {
                  receiverId: userId,
                  status: "ACCEPTED",
                },
              },
            },
            {
              receivedFriendships: {
                some: {
                  senderId: userId,
                  status: "ACCEPTED",
                },
              },
            },
          ],
        },
      },
      include: {
        items: {
          include: {
            reservation: {
              include: {
                reservedBy: {
                  select: {
                    id: true,
                    name: true,
                    avatar: true,
                  },
                },
              },
            },
          },
        },
        profile: {
          include: {
            avatar: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
};
