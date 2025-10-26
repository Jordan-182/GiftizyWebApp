"use server";

import { auth } from "@/lib/auth";
import { updateFriendRequestSchema } from "@/schemas/user.schema";
import { friendService } from "@/services/friendService";
import { headers } from "next/headers";

export async function updateFriendRequestAction(
  friendshipId: string,
  accept: boolean
) {
  try {
    // Vérification de l'authentification
    const headersList = await headers();
    const session = await auth.api.getSession({
      headers: headersList,
    });

    if (!session) {
      throw new Error("Non autorisé");
    }

    // Validation des paramètres avec Zod
    const validationResult = updateFriendRequestSchema.safeParse({
      friendshipId,
      accept,
    });

    if (!validationResult.success) {
      const errorMessage =
        validationResult.error.issues[0]?.message || "Paramètres invalides";
      throw new Error(errorMessage);
    }

    // Mise à jour de la demande d'amitié
    const result = await friendService.updateFriendRequest(
      friendshipId,
      accept
    );

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error("Erreur dans updateFriendRequestAction:", error);

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Une erreur inconnue est survenue",
    };
  }
}
