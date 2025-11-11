"use server";

import { auth } from "@/lib/auth";
import { eventService } from "@/services/eventService";

export async function getUpcomingEventsAction() {
  try {
    // Vérification de l'authentification
    const session = await auth.api.getSession({
      headers: await import("next/headers").then((mod) => mod.headers()),
    });

    if (!session) {
      throw new Error("Non autorisé");
    }

    // Récupérer les événements en parallèle
    const [userEvents, eventInvitations] = await Promise.all([
      // Événements créés par l'utilisateur
      eventService.getEventsByUser(session.user.id),

      // Invitations aux événements
      eventService.getEventInvitations(session.user.id),
    ]);

    const now = new Date();

    // Événements créés par moi (non expirés)
    const myUpcomingEvents = userEvents
      .filter((event) => new Date(event.date) > now)
      .map((event) => ({
        ...event,
        role: "host" as const,
        source: "created" as const,
      }));

    // Événements où j'ai accepté l'invitation (non expirés)
    const acceptedUpcomingEvents = eventInvitations
      .filter(
        (invitation) =>
          invitation.status === "ACCEPTED" &&
          new Date(invitation.event.date) > now
      )
      .map((invitation) => ({
        ...invitation.event,
        role: "participant" as const,
        source: "invited" as const,
        host: invitation.event.host,
      }));

    // Combiner et trier par date
    const allUpcomingEvents = [
      ...myUpcomingEvents,
      ...acceptedUpcomingEvents,
    ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return {
      success: true,
      data: allUpcomingEvents,
    };
  } catch (error) {
    console.error("Erreur dans getUpcomingEventsAction:", error);

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Erreur lors de la récupération des événements à venir",
      data: [],
    };
  }
}
