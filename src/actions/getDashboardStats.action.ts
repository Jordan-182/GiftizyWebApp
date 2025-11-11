"use server";

import { auth } from "@/lib/auth";
import { eventService } from "@/services/eventService";
import { friendService } from "@/services/friendService";
import { wishlistService } from "@/services/wishlistService";

export async function getDashboardStatsAction() {
  try {
    // Vérification de l'authentification
    const session = await auth.api.getSession({
      headers: await import("next/headers").then((mod) => mod.headers()),
    });

    if (!session) {
      throw new Error("Non autorisé");
    }

    // Récupérer toutes les statistiques en parallèle
    const [wishlists, friends, userEvents, eventInvitations] =
      await Promise.all([
        // Nombre de wishlists de l'utilisateur
        wishlistService.getWishlistsByUser(session.user.id),

        // Nombre d'amis
        friendService.getFriends(session.user.id),

        // Événements créés par l'utilisateur
        eventService.getEventsByUser(session.user.id),

        // Invitations aux événements acceptées
        eventService.getEventInvitations(session.user.id),
      ]);

    // Filtrer les événements où je participe (créés par moi + invitations acceptées) et non expirés
    const now = new Date();

    // Événements créés par moi (non expirés)
    const myActiveEvents = userEvents.filter(
      (event) => new Date(event.date) > now
    );

    // Événements où j'ai accepté l'invitation (non expirés)
    const acceptedEventInvitations = eventInvitations.filter(
      (invitation) =>
        invitation.status === "ACCEPTED" &&
        new Date(invitation.event.date) > now
    );

    // Total des événements auxquels je participe
    const totalActiveEvents =
      myActiveEvents.length + acceptedEventInvitations.length;

    return {
      success: true,
      data: {
        wishlistsCount: wishlists.length,
        friendsCount: friends.length,
        eventsCount: totalActiveEvents,
      },
    };
  } catch (error) {
    console.error("Erreur dans getDashboardStatsAction:", error);

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Erreur lors de la récupération des statistiques",
      data: {
        wishlistsCount: 0,
        friendsCount: 0,
        eventsCount: 0,
      },
    };
  }
}
