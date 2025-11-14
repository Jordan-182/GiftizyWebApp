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
                avatar: true,
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
                avatar: true,
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
        ...(data.location !== undefined && {
          location: data.location || null,
        }),
        ...(data.profileId !== undefined && {
          profileId: data.profileId || null,
        }),
      },
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
    });
  },

  delete: (id: string) =>
    prisma.event.delete({
      where: { id },
    }),

  // Obtenir tous les événements (hôte + invité accepté) pour l'utilisateur avec un role ajouté
  findUpcomingEvents: (userId: string) =>
    prisma.event.findMany({
      where: {
        OR: [
          // Événements où l'utilisateur est l'hôte
          { hostId: userId },
          // Événements où l'utilisateur est invité et a accepté
          {
            invitations: {
              some: {
                friendId: userId,
                status: "ACCEPTED",
              },
            },
          },
        ],
        date: {
          gte: new Date(), // Seulement les événements futurs
        },
      },
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
          },
        },
      },
      orderBy: {
        date: "asc",
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
                avatar: true,
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

  // Récupérer les événements en commun entre deux utilisateurs
  findCommonEvents: (userId1: string, userId2: string) =>
    prisma.event.findMany({
      where: {
        OR: [
          // Cas 1: userId1 est hôte et userId2 est invité (accepté)
          {
            hostId: userId1,
            invitations: {
              some: {
                friendId: userId2,
                status: "ACCEPTED",
              },
            },
          },
          // Cas 2: userId2 est hôte et userId1 est invité (accepté)
          {
            hostId: userId2,
            invitations: {
              some: {
                friendId: userId1,
                status: "ACCEPTED",
              },
            },
          },
          // Cas 3: Les deux sont invités à un événement (ni l'un ni l'autre n'est hôte)
          {
            AND: [
              {
                NOT: {
                  OR: [{ hostId: userId1 }, { hostId: userId2 }],
                },
              },
              {
                invitations: {
                  some: {
                    friendId: userId1,
                    status: "ACCEPTED",
                  },
                },
              },
              {
                invitations: {
                  some: {
                    friendId: userId2,
                    status: "ACCEPTED",
                  },
                },
              },
            ],
          },
        ],
      },
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
      },
      orderBy: {
        date: "asc",
      },
    }),

  // Quitter un événement (pour les invités)
  leaveEvent: (eventId: string, userId: string) =>
    prisma.eventInvitation.delete({
      where: {
        eventId_friendId: {
          eventId,
          friendId: userId,
        },
      },
    }),

  // Méthodes manquantes nécessaires pour eventService
  findInvitationsByUser: (userId: string) =>
    prisma.eventInvitation.findMany({
      where: {
        friendId: userId,
        status: "PENDING",
      },
      include: {
        event: {
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
              },
            },
          },
        },
      },
    }),

  findByIdAndUser: (eventId: string, userId: string) =>
    prisma.event.findFirst({
      where: {
        id: eventId,
        hostId: userId,
      },
    }),

  findInvitation: (eventId: string, friendId: string) =>
    prisma.eventInvitation.findUnique({
      where: {
        eventId_friendId: {
          eventId,
          friendId,
        },
      },
    }),

  createInvitation: (eventId: string, friendId: string) =>
    prisma.eventInvitation.create({
      data: {
        eventId,
        friendId,
        status: "PENDING",
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

  findCommonEventsWithProfile: (userId: string, profileId: string) =>
    prisma.event.findMany({
      where: {
        OR: [
          // Événements où l'utilisateur est hôte avec ce profil
          {
            hostId: userId,
            profileId: profileId,
          },
          // Événements où l'utilisateur est invité (accepté) avec ce profil
          {
            profileId: profileId,
            invitations: {
              some: {
                friendId: userId,
                status: "ACCEPTED",
              },
            },
          },
        ],
      },
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
      },
      orderBy: {
        date: "asc",
      },
    }),
};
