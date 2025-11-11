"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function getMyReservationsAction() {
  try {
    // Vérification de l'authentification
    const session = await auth.api.getSession({
      headers: await import("next/headers").then((mod) => mod.headers()),
    });

    if (!session) {
      throw new Error("Non autorisé");
    }

    // Récupérer tous les articles réservés par l'utilisateur connecté
    const reservations = await prisma.itemReservation.findMany({
      where: {
        reservedById: session.user.id,
      },
      include: {
        item: {
          include: {
            wishlist: {
              include: {
                profile: {
                  select: {
                    id: true,
                    name: true,
                    avatar: true,
                  },
                },
                user: {
                  select: {
                    id: true,
                    name: true,
                    avatar: true,
                  },
                },
                event: {
                  select: {
                    id: true,
                    name: true,
                    date: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,
      data: reservations,
    };
  } catch (error) {
    console.error("Erreur dans getMyReservationsAction:", error);

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Erreur lors de la récupération de vos réservations",
      data: [],
    };
  }
}
