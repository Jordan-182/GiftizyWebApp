"use server";

import { auth } from "@/lib/auth";
import { friendService } from "@/services/friendService";
import { headers } from "next/headers";

export async function getFriendsAction() {
  try {
    // Vérification de l'authentification
    const headersList = await headers();
    const session = await auth.api.getSession({
      headers: headersList,
    });

    if (!session) {
      throw new Error("Non autorisé");
    }

    // Récupération des amis
    const friends = await friendService.getFriends(session.user.id);

    return {
      success: true,
      data: friends,
    };
  } catch (error) {
    console.error("Erreur dans getFriendsAction:", error);

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Une erreur inconnue est survenue",
    };
  }
}
