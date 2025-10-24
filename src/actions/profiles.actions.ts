"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { ProfileActionData } from "@/repositories/profileRepository";
import { profileService } from "@/services/profileService";
import { revalidateTag } from "next/cache";
import { cache } from "react";
import { z } from "zod";

// ===============================
// TYPES PARTAGÉS
// ===============================

export type ProfileActionResult = {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
  profileId?: string;
};

// ===============================
// SCHÉMAS DE VALIDATION
// ===============================

const ProfileFormSchema = z.object({
  name: z
    .string()
    .min(1, "Le nom est obligatoire")
    .max(100, "Le nom est trop long"),
  description: z.string().max(500, "La description est trop longue").optional(),
  birthDate: z
    .string()
    .optional()
    .refine((date) => {
      if (!date || date === "") return true; // Optionnel
      const parsedDate = new Date(date);
      return !isNaN(parsedDate.getTime()); // Vérifier que c'est une date valide
    }, "Date de naissance invalide"),
  avatarId: z.string().optional(),
  isMainProfile: z.boolean().default(false),
  friendCode: z.string().min(1, "Le code ami est obligatoire"),
});

// ===============================
// FONCTIONS UTILITAIRES PRIVÉES
// ===============================

async function getAuthenticatedUser() {
  const session = await auth.api.getSession({
    headers: await import("next/headers").then((mod) => mod.headers()),
  });

  if (!session) {
    throw new Error("Non autorisé");
  }

  return session.user;
}

function invalidateProfilesCache(friendCode: string) {
  revalidateTag(`profiles-${friendCode}`);
  revalidateTag(`user-profiles`);
}

// ===============================
// ACTIONS LECTURES (avec cache)
// ===============================

/**
 * Récupère tous les profils d'un utilisateur par son friendCode
 * Cette action peut être appelée par n'importe qui (profils publics)
 */
export const getProfilesAction = cache(async (friendCode: string) => {
  try {
    return await profileService.getProfilesByfriendCode(friendCode);
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : "Erreur lors de la récupération des profils"
    );
  }
});

/**
 * Récupère les profils de l'utilisateur connecté
 */
export const getMyProfilesAction = cache(async () => {
  const user = await getAuthenticatedUser();

  try {
    return await profileService.getProfilesByfriendCode(user.friendCode);
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : "Erreur lors de la récupération de vos profils"
    );
  }
});

// ===============================
// ACTIONS MUTATIONS
// ===============================

/**
 * Crée un nouveau profil pour l'utilisateur connecté
 */
export async function createProfileAction(
  _prevState: ProfileActionResult,
  formData: FormData
): Promise<ProfileActionResult> {
  try {
    const user = await getAuthenticatedUser();

    // Validation que l'utilisateur crée un profil pour lui-même
    const friendCode = formData.get("friendCode") as string;
    if (user.friendCode !== friendCode) {
      return {
        success: false,
        error: "Vous ne pouvez créer un profil que pour votre propre compte",
      };
    }

    // Extraction des données du formulaire
    const rawData = {
      name: formData.get("name") as string,
      description: (formData.get("description") as string) || undefined,
      birthDate: (formData.get("birthDate") as string) || undefined,
      avatarId: (formData.get("avatarId") as string) || undefined,
      isMainProfile: formData.get("isMainProfile") === "true",
      friendCode: friendCode,
    };

    // Validation avec Zod
    const validatedData = ProfileFormSchema.parse(rawData);

    // Préparation des données pour le service
    const profileCreateData: ProfileActionData = {
      name: validatedData.name,
      birthDate: validatedData.birthDate
        ? new Date(validatedData.birthDate)
        : null,
      friendCode: validatedData.friendCode,
      avatarId: validatedData.avatarId || null,
      isMainProfile: validatedData.isMainProfile,
    };

    // Création via le service (qui appelle le repository qui appelle Prisma)
    const newProfile = await profileService.createProfileFromAction(
      profileCreateData
    );

    // Invalidation du cache
    invalidateProfilesCache(user.friendCode);

    return {
      success: true,
      profileId: newProfile.id,
    };
  } catch (error) {
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
      error: error instanceof Error ? error.message : "Erreur inconnue",
    };
  }
}

/**
 * Supprime un profil pour l'utilisateur connecté
 */
export async function deleteProfileAction(
  profileId: string
): Promise<ProfileActionResult> {
  try {
    const user = await getAuthenticatedUser();

    // Vérifier que le profil appartient à l'utilisateur connecté
    const profile = await prisma.profile.findFirst({
      where: {
        id: profileId,
        user: { friendCode: user.friendCode },
      },
    });

    if (!profile) {
      return {
        success: false,
        error: "Profil non trouvé ou accès non autorisé",
      };
    }

    await profileService.deleteProfileById(profileId);

    // Invalidation du cache
    invalidateProfilesCache(user.friendCode);

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Erreur lors de la suppression du profil",
    };
  }
}

/**
 * Supprime un profil par friendCode et profileId (pour les routes dynamiques)
 */
export async function deleteProfileByFriendCodeAction(
  friendCode: string,
  profileId: string
): Promise<ProfileActionResult> {
  try {
    const user = await getAuthenticatedUser();

    // Vérifier que l'utilisateur a le droit de supprimer ce profil
    if (user.friendCode !== friendCode) {
      return {
        success: false,
        error: "Non autorisé",
      };
    }

    // Vérifier que le profil existe et appartient à l'utilisateur
    const profile = await prisma.profile.findFirst({
      where: {
        id: profileId,
        user: { friendCode: friendCode },
      },
    });

    if (!profile) {
      return {
        success: false,
        error: "Profil non trouvé",
      };
    }

    await profileService.deleteProfileById(profileId);

    // Invalidation du cache
    invalidateProfilesCache(friendCode);

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Erreur lors de la suppression du profil",
    };
  }
}

/**
 * Met à jour un profil par friendCode et profileId (pour les routes dynamiques)
 */
export async function updateProfileByFriendCodeAction(
  friendCode: string,
  profileId: string,
  _prevState: ProfileActionResult,
  formData: FormData
): Promise<ProfileActionResult> {
  try {
    const user = await getAuthenticatedUser();

    // Vérifier que l'utilisateur a le droit de modifier ce profil
    if (user.friendCode !== friendCode) {
      return {
        success: false,
        error: "Non autorisé",
      };
    }

    // Vérifier que le profil existe et appartient à l'utilisateur
    const existingProfile = await prisma.profile.findFirst({
      where: {
        id: profileId,
        user: { friendCode: friendCode },
      },
    });

    if (!existingProfile) {
      return {
        success: false,
        error: "Profil non trouvé",
      };
    }

    // Extraction des données du formulaire
    const rawData = {
      name: formData.get("name") as string,
      description: (formData.get("description") as string) || undefined,
      birthDate: (formData.get("birthDate") as string) || undefined,
      avatarId: (formData.get("avatarId") as string) || undefined,
      isMainProfile: formData.get("isMainProfile") === "true",
      friendCode: friendCode,
    };

    // Validation avec Zod
    const validatedData = ProfileFormSchema.parse(rawData);

    // Contournement du problème de type : appel direct au repository
    const profileData: ProfileActionData = {
      name: validatedData.name,
      birthDate: validatedData.birthDate
        ? new Date(validatedData.birthDate)
        : null,
      friendCode: friendCode,
      avatarId: validatedData.avatarId || null,
      isMainProfile: validatedData.isMainProfile,
    };

    // Appel du service avec les bons types
    await profileService.editProfileFromAction(profileId, profileData);

    // Invalidation du cache
    invalidateProfilesCache(friendCode);

    return {
      success: true,
      profileId: profileId,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        fieldErrors: error.flatten().fieldErrors as Record<string, string>,
      };
    }

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Erreur lors de la mise à jour du profil",
    };
  }
}

/**
 * Met à jour un profil pour l'utilisateur connecté
 */
export async function updateProfileAction(
  profileId: string,
  _prevState: ProfileActionResult,
  formData: FormData
): Promise<ProfileActionResult> {
  try {
    const user = await getAuthenticatedUser();

    // Vérifier que le profil appartient à l'utilisateur connecté
    const existingProfile = await prisma.profile.findFirst({
      where: {
        id: profileId,
        user: { friendCode: user.friendCode },
      },
    });

    if (!existingProfile) {
      return {
        success: false,
        error: "Profil non trouvé ou accès non autorisé",
      };
    }

    // Extraction des données du formulaire
    const rawData = {
      name: formData.get("name") as string,
      description: (formData.get("description") as string) || undefined,
      birthDate: (formData.get("birthDate") as string) || undefined,
      avatarId: (formData.get("avatarId") as string) || undefined,
      isMainProfile: formData.get("isMainProfile") === "true",
      friendCode: user.friendCode,
    };

    // Validation avec Zod
    const validatedData = ProfileFormSchema.parse(rawData);

    // Contournement du problème de type : appel direct au repository
    // Car ProfileFormData attend string mais Prisma attend Date
    const profileData: ProfileActionData = {
      name: validatedData.name,
      birthDate: validatedData.birthDate
        ? new Date(validatedData.birthDate)
        : null,
      friendCode: user.friendCode,
      avatarId: validatedData.avatarId || null,
      isMainProfile: validatedData.isMainProfile,
    };

    // Appel du service avec les bons types
    await profileService.editProfileFromAction(profileId, profileData);

    // Invalidation du cache
    invalidateProfilesCache(user.friendCode);

    return {
      success: true,
      profileId: profileId,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        fieldErrors: error.flatten().fieldErrors as Record<string, string>,
      };
    }

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Erreur lors de la mise à jour du profil",
    };
  }
}
