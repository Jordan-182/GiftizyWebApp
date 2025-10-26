"use server";

import { auth } from "@/lib/auth";
import { profileRepository } from "@/repositories/profileRepository";
import { unstable_cache } from "next/cache";

export async function getUserProfilesAction() {
  try {
    // 1. Authentification
    const session = await auth.api.getSession({
      headers: await import("next/headers").then((mod) => mod.headers()),
    });
    if (!session) {
      throw new Error("Non autorisé");
    }

    // 2. Utilisation du cache Next.js avec tags pour une invalidation sélective
    const cachedProfiles = unstable_cache(
      async (userId: string) => {
        return await profileRepository.findByUserId(userId);
      },
      [`user-profiles-${session.user.id}`],
      {
        tags: [`user-profiles-${session.user.id}`],
        revalidate: 3600, // Cache pendant 1 heure
      }
    );

    const profiles = await cachedProfiles(session.user.id);
    return profiles;
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : "Erreur lors de la récupération des profils"
    );
  }
}
