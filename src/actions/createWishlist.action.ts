"use server";

import { auth } from "@/lib/auth";
import { profileRepository } from "@/repositories/profileRepository";
import { CreateWishlistSchema } from "@/schemas/wishlist.schema";
import { wishlistService } from "@/services/wishlistService";
import { revalidateTag } from "next/cache";
import { z } from "zod";

export type CreateWishlistState = {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
};

export async function createWishlistAction(
  _prevState: CreateWishlistState,
  formData: FormData
): Promise<CreateWishlistState> {
  try {
    // 1. Authentification
    const session = await auth.api.getSession({
      headers: await import("next/headers").then((mod) => mod.headers()),
    });
    if (!session) {
      return {
        success: false,
        error: "Non autorisé",
      };
    }

    // 2. Extraction et validation des données
    const rawFormData = {
      name: formData.get("name") as string,
      description: (formData.get("description") as string) || "",
      profileId: formData.get("profileId") as string,
    };

    // 3. Validation Zod
    const validatedData = CreateWishlistSchema.parse(rawFormData);

    // 4. Vérification que le profil appartient à l'utilisateur
    const userProfiles = await profileRepository.findByUserId(session.user.id);
    const profileExists = userProfiles.some(
      (profile) => profile.id === validatedData.profileId
    );

    if (!profileExists) {
      return {
        success: false,
        error: "Le profil sélectionné ne vous appartient pas",
      };
    }

    // 5. Appel du service
    await wishlistService.createWishlist(validatedData, session.user.id);

    // 6. Invalidation sélective du cache
    revalidateTag(`user-wishlists-${session.user.id}`);

    return { success: true };
  } catch (error) {
    // Gestion des erreurs Zod
    if (error instanceof z.ZodError) {
      const fieldErrors = error.issues.reduce((acc, issue) => {
        acc[issue.path.join(".")] = issue.message;
        return acc;
      }, {} as Record<string, string>);

      return {
        success: false,
        error: "Données invalides",
        fieldErrors,
      };
    }

    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Erreur lors de la création",
    };
  }
}
