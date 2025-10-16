import { prisma } from "@/lib/prisma";

export const friendRepository = {
  getFriends: (userId: string) =>
    prisma.friendship.findMany({
      where: {
        status: "ACCEPTED",
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      include: {
        receiver: {
          select: {
            id: true,
            name: true,
            friendCode: true,
            avatar: true,
          },
        },
        sender: {
          select: {
            id: true,
            name: true,
            friendCode: true,
            avatar: true,
          },
        },
      },
    }),

  getReceivedFriendRequests: (userId: string) =>
    prisma.friendship.findMany({
      where: {
        receiverId: userId,
        status: "PENDING",
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            friendCode: true,
            avatar: true,
          },
        },
      },
    }),

  getSentFriendRequests: (userId: string) =>
    prisma.friendship.findMany({
      where: {
        senderId: userId,
        status: "PENDING",
      },
      include: {
        receiver: {
          select: {
            id: true,
            name: true,
            friendCode: true,
            avatar: true,
          },
        },
      },
    }),
};
