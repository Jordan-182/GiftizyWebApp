"use server";

import { auth } from "@/lib/auth";
import { wishlistService } from "@/services/wishlistService";
import { unstable_cache } from "next/cache";

export async function getWishlistsAction() {
  try {
    // 1. Authentification
    const session = await auth.api.getSession({
      headers: await import("next/headers").then((mod) => mod.headers()),
    });
    if (!session) {
      throw new Error("Non autorisé");
    }

    // 2. Utilisation du cache Next.js avec tags pour une invalidation sélective
    const cachedWishlists = unstable_cache(
      async (userId: string) => {
        return await wishlistService.getWishlistsByUser(userId);
      },
      [`user-wishlists-${session.user.id}`],
      {
        tags: [`user-wishlists-${session.user.id}`],
        revalidate: 3600, // Cache pendant 1 heure
      }
    );

    const wishlists = await cachedWishlists(session.user.id);
    return wishlists;
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : "Erreur lors de la récupération des wishlists"
    );
  }
}

export async function getWishlistsByUserAction(userId: string) {
  try {
    // 1. Authentification
    const session = await auth.api.getSession({
      headers: await import("next/headers").then((mod) => mod.headers()),
    });
    if (!session) {
      throw new Error("Non autorisé");
    }

    // 2. Utilisation du cache Next.js avec tags pour une invalidation sélective
    const cachedWishlists = unstable_cache(
      async (userId: string) => {
        return await wishlistService.getWishlistsByUser(userId);
      },
      [`user-wishlists-${session.user.id}`],
      {
        tags: [`user-wishlists-${session.user.id}`],
        revalidate: 3600, // Cache pendant 1 heure
      }
    );

    const wishlists = await cachedWishlists(userId);
    return wishlists;
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : "Erreur lors de la récupération des wishlists"
    );
  }
}
