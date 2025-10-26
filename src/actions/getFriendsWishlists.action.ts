"use server";

import { auth } from "@/lib/auth";
import { wishlistService } from "@/services/wishlistService";

export async function getFriendsWishlistsActionRealTime() {
  try {
    // 1. Authentification
    const session = await auth.api.getSession({
      headers: await import("next/headers").then((mod) => mod.headers()),
    });
    if (!session) {
      throw new Error("Non autorisé");
    }

    // 2. Récupération directe sans cache pour des données temps réel
    const friendsWishlists = await wishlistService.getFriendsWishlists(
      session.user.id
    );
    return friendsWishlists;
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : "Erreur lors de la récupération des listes de vos amis"
    );
  }
}
