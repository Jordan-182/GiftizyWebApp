"use server";

import { auth } from "@/lib/auth";
import { wishlistService } from "@/services/wishlistService";
import { unstable_cache } from "next/cache";

export async function getWishlistByIdAction(wishlistId: string) {
  try {
    // 1. Authentification
    const session = await auth.api.getSession({
      headers: await import("next/headers").then((mod) => mod.headers()),
    });
    if (!session) {
      throw new Error("Non autorisé");
    }

    // 2. Utilisation du cache Next.js avec tags pour une invalidation sélective
    const cachedWishlist = unstable_cache(
      async (id: string) => {
        return await wishlistService.getWishlistById(id);
      },
      [`wishlist-${wishlistId}`],
      {
        tags: [`wishlist-${wishlistId}`, `user-wishlists-${session.user.id}`],
        revalidate: 3600, // Cache pendant 1 heure
      }
    );

    const wishlist = await cachedWishlist(wishlistId);
    return wishlist;
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : "Erreur lors de la récupération de la wishlist"
    );
  }
}
