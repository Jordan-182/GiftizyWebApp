import { prisma } from "@/lib/prisma";
import type {
  CreateEventInput,
  UpdateEventInput,
} from "@/schemas/event.schema";

export const eventRepository = {
  findAll: () =>
    prisma.event.findMany({
      include: {
        host: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        profile: {
          select: {
            id: true,
            name: true,
          },
        },
        wishlist: {
          include: {
            items: true,
          },
        },
        invitations: {
          include: {
            friend: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    }),

  findById: (id: string) =>
    prisma.event.findUnique({
      where: { id },
      include: {
        host: {
          select: {
            id: true,
            name: true,
          },
        },
        profile: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        wishlist: {
          include: {
            items: true,
          },
        },
        invitations: {
          include: {
            friend: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
        },
      },
    }),

  findByUser: (userId: string) =>
    prisma.event.findMany({
      where: {
        hostId: userId,
      },
      include: {
        host: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        profile: {
          select: {
            id: true,
            name: true,
          },
        },
        wishlist: {
          include: {
            items: true,
          },
        },
        invitations: {
          include: {
            friend: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        date: "asc",
      },
    }),

  create: async (data: CreateEventInput) => {
    // Traiter la date comme une datetime locale sans conversion UTC
    const eventDate = new Date(data.date);

    return prisma.$transaction(async (tx) => {
      // 1. Créer l'événement
      const event = await tx.event.create({
        data: {
          name: data.name,
          description: data.description || null,
          date: eventDate,
          location: data.location || null,
          hostId: data.hostId,
          profileId: data.profileId || null,
        },
        include: {
          host: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          profile: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      // 2. Déterminer le profil à utiliser pour la wishlist
      let wishlistProfileId = data.profileId;

      // Si aucun profil n'est spécifié, utiliser le profil principal de l'utilisateur
      if (!wishlistProfileId) {
        const mainProfile = await tx.profile.findFirst({
          where: {
            userId: data.hostId,
            isMainProfile: true,
          },
          select: {
            id: true,
          },
        });

        if (!mainProfile) {
          throw new Error("Aucun profil principal trouvé pour l'utilisateur");
        }

        wishlistProfileId = mainProfile.id;
      }

      // 3. Créer automatiquement une wishlist affiliée à l'événement
      await tx.wishlist.create({
        data: {
          name: `${event.name}`,
          description: `Liste de cadeaux pour l'événement ${event.name}`,
          isEventWishlist: true,
          userId: data.hostId,
          profileId: wishlistProfileId,
          eventId: event.id,
        },
      });

      return event;
    });
  },

  update: (id: string, data: Partial<UpdateEventInput>) => {
    return prisma.event.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.description !== undefined && {
          description: data.description || null,
        }),
        ...(data.date && { date: new Date(data.date) }),
        ...(data.location !== undefined && { location: data.location || null }),
        ...(data.profileId !== undefined && {
          profileId: data.profileId || null,
        }),
      },
      include: {
        host: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        profile: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  },

  delete: async (id: string) => {
    return prisma.$transaction(async (tx) => {
      // 1. Supprimer d'abord la wishlist associée à l'événement (si elle existe)
      await tx.wishlist.deleteMany({
        where: {
          eventId: id,
        },
      });

      // 2. Supprimer l'événement (les invitations seront supprimées automatiquement grâce à onDelete: Cascade)
      return tx.event.delete({
        where: { id },
      });
    });
  },

  // Vérifier si un événement appartient à un utilisateur
  findByIdAndUser: (id: string, userId: string) =>
    prisma.event.findFirst({
      where: {
        id,
        hostId: userId,
      },
    }),

  // Gestion des invitations
  createInvitation: (eventId: string, friendId: string) =>
    prisma.eventInvitation.create({
      data: {
        eventId,
        friendId,
        status: "PENDING",
      },
      include: {
        event: {
          select: {
            id: true,
            name: true,
            date: true,
            location: true,
          },
        },
        friend: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    }),

  updateInvitationStatus: (
    eventId: string,
    friendId: string,
    status: "ACCEPTED" | "DECLINED"
  ) =>
    prisma.eventInvitation.update({
      where: {
        eventId_friendId: {
          eventId,
          friendId,
        },
      },
      data: {
        status,
      },
    }),

  findInvitationsByUser: (userId: string) =>
    prisma.eventInvitation.findMany({
      where: {
        friendId: userId,
        status: {
          in: ["PENDING", "ACCEPTED"],
        },
      },
      include: {
        event: {
          include: {
            host: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            profile: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        event: {
          date: "asc",
        },
      },
    }),

  // Vérifier si une invitation existe déjà
  findInvitation: (eventId: string, friendId: string) =>
    prisma.eventInvitation.findUnique({
      where: {
        eventId_friendId: {
          eventId,
          friendId,
        },
      },
    }),

  // Trouver les événements des amis auxquels l'utilisateur a été invité et a accepté
  findFriendsEvents: (userId: string) =>
    prisma.event.findMany({
      where: {
        invitations: {
          some: {
            friendId: userId,
            status: "ACCEPTED",
          },
        },
      },
      include: {
        host: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        profile: {
          select: {
            id: true,
            name: true,
          },
        },
        invitations: {
          include: {
            friend: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        date: "asc",
      },
    }),

  // Supprimer une invitation
  deleteInvitation: (eventId: string, friendId: string) =>
    prisma.eventInvitation.delete({
      where: {
        eventId_friendId: {
          eventId,
          friendId,
        },
      },
    }),
};
