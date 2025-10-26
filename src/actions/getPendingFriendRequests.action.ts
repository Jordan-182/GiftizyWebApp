"use server";

import { auth } from "@/lib/auth";
import { friendService } from "@/services/friendService";
import { headers } from "next/headers";

export async function getPendingFriendRequestsAction() {
  try {
    // Vérification de l'authentification
    const headersList = await headers();
    const session = await auth.api.getSession({
      headers: headersList,
    });

    if (!session) {
      throw new Error("Non autorisé");
    }

    // Récupération des demandes d'amitié en attente
    const pendingRequests = await friendService.getPendingFriendRequests(
      session.user.id
    );

    return {
      success: true,
      data: pendingRequests,
    };
  } catch (error) {
    console.error("Erreur dans getPendingFriendRequestsAction:", error);

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Une erreur inconnue est survenue",
    };
  }
}
