import { prisma } from "@/lib/prisma";

export const friendRepository = {
  findByFriendCode: (friendId: string) =>
    prisma.user.findUnique({
      where: { id: friendId },
      select: {
        id: true,
        name: true,
        friendCode: true,
        avatar: true,
      },
    }),

  findExistingFriendship: (userId: string, friendId: string) =>
    prisma.friendship.findFirst({
      where: {
        OR: [
          { senderId: userId, receiverId: friendId },
          { senderId: friendId, receiverId: userId },
        ],
      },
    }),

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

  getPendingFriendRequests: (userId: string) =>
    prisma.friendship.findMany({
      where: {
        status: "PENDING",
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

  // Récupère uniquement les demandes d'amis reçues (pour les notifications)
  getReceivedPendingFriendRequests: (userId: string) =>
    prisma.friendship.findMany({
      where: {
        status: "PENDING",
        receiverId: userId, // Seulement les demandes reçues
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

  createFriendRequest: (userId: string, friendId: string) =>
    prisma.friendship.create({
      data: {
        senderId: userId,
        receiverId: friendId,
        status: "PENDING",
      },
    }),

  updateFriendRequest: (friendshipId: string, accept: boolean) =>
    prisma.friendship.update({
      where: {
        id: friendshipId,
      },
      data: {
        status: accept ? "ACCEPTED" : "DECLINED",
      },
    }),

  deleteFriendship: (friendshipId: string) =>
    prisma.friendship.delete({
      where: {
        id: friendshipId,
      },
    }),
};
