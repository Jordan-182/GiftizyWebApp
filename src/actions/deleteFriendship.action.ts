"use server";

import { auth } from "@/lib/auth";
import { friendshipIdSchema } from "@/schemas/user.schema";
import { friendService } from "@/services/friendService";
import { headers } from "next/headers";

export async function deleteFriendshipAction(friendshipId: string) {
  try {
    // Vérification de l'authentification
    const headersList = await headers();
    const session = await auth.api.getSession({
      headers: headersList,
    });

    if (!session) {
      throw new Error("Non autorisé");
    }

    // Validation de l'ID de l'amitié avec Zod
    const validationResult = friendshipIdSchema.safeParse({
      friendshipId,
    });

    if (!validationResult.success) {
      const errorMessage =
        validationResult.error.issues[0]?.message || "ID d'amitié invalide";
      throw new Error(errorMessage);
    }

    // Suppression de l'amitié
    const result = await friendService.deleteFriendship(friendshipId);

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error("Erreur dans deleteFriendshipAction:", error);

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Une erreur inconnue est survenue",
    };
  }
}
