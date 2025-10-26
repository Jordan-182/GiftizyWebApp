"use server";

import { auth } from "@/lib/auth";
import { checkFriendshipStatusSchema } from "@/schemas/user.schema";
import { friendService } from "@/services/friendService";
import { headers } from "next/headers";

export async function checkFriendshipStatusAction(userId: string) {
  try {
    // Vérification de l'authentification
    const headersList = await headers();
    const session = await auth.api.getSession({
      headers: headersList,
    });

    if (!session) {
      throw new Error("Non autorisé");
    }

    // Validation de l'ID utilisateur avec Zod
    const validationResult = checkFriendshipStatusSchema.safeParse({
      userId,
    });

    if (!validationResult.success) {
      const errorMessage =
        validationResult.error.issues[0]?.message || "ID utilisateur invalide";
      throw new Error(errorMessage);
    }

    // Vérification du statut d'amitié
    const status = await friendService.checkFriendshipStatus(
      session.user.id,
      userId
    );

    return {
      success: true,
      data: status,
    };
  } catch (error) {
    console.error("Erreur dans checkFriendshipStatusAction:", error);

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Une erreur inconnue est survenue",
    };
  }
}
