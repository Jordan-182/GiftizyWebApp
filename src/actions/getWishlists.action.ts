"use server";

import { auth } from "@/lib/auth";
import { wishlistService } from "@/services/wishlistService";
import { unstable_cache } from "next/cache";
import { z } from "zod";

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

export async function getWishlistsByProfileIdAction(profileId: string) {
  try {
    // 1. Authentification
    const session = await auth.api.getSession({
      headers: await import("next/headers").then((mod) => mod.headers()),
    });
    if (!session) {
      throw new Error("Non autorisé");
    }

    // 2. Validation de l'ID du profil
    const profileIdSchema = z.string().uuid("ID de profil invalide");
    const validatedProfileId = profileIdSchema.parse(profileId);

    // 3. Vérification de l'accès au profil (sécurité)
    const { getProfileByIdAction } = await import("./profiles.actions");
    const profile = await getProfileByIdAction(validatedProfileId);

    // Si getProfileByIdAction ne lève pas d'erreur, l'utilisateur a accès au profil
    // (soit c'est son profil, soit il est ami avec le propriétaire)

    // 4. Récupération des wishlists avec cache
    const cachedWishlists = unstable_cache(
      async (profileId: string) => {
        return await wishlistService.getWishlistsByProfileId(profileId);
      },
      [`profile-wishlists-${validatedProfileId}`],
      {
        tags: [`profile-wishlists-${validatedProfileId}`, `user-wishlists-${profile.user.id}`],
        revalidate: 3600, // Cache pendant 1 heure
      }
    );

    const wishlists = await cachedWishlists(validatedProfileId);
    return wishlists;
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error("ID de profil invalide");
    }
    
    throw new Error(
      error instanceof Error
        ? error.message
        : "Erreur lors de la récupération des wishlists du profil"
    );
  }
}
