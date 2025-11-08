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

  create: (data: CreateEventInput) => {
    // Traiter la date comme une datetime locale sans conversion UTC
    const eventDate = new Date(data.date);

    return prisma.event.create({
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

  delete: (id: string) =>
    prisma.event.delete({
      where: { id },
    }),

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
};
