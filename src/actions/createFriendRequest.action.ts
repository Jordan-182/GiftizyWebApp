"use server";

import { auth } from "@/lib/auth";
import { createFriendRequestSchema } from "@/schemas/user.schema";
import { friendService } from "@/services/friendService";
import { headers } from "next/headers";

export async function createFriendRequestAction(friendId: string) {
  try {
    // Vérification de l'authentification
    const headersList = await headers();
    const session = await auth.api.getSession({
      headers: headersList,
    });

    if (!session) {
      throw new Error("Non autorisé");
    }

    // Validation de l'ID de l'ami avec Zod
    const validationResult = createFriendRequestSchema.safeParse({
      friendId,
    });

    if (!validationResult.success) {
      const errorMessage =
        validationResult.error.issues[0]?.message || "ID d'ami invalide";
      throw new Error(errorMessage);
    }

    // Création de la demande d'amitié
    const newFriendRequest = await friendService.createFriendRequest(
      session.user.id,
      friendId
    );

    return {
      success: true,
      data: newFriendRequest,
    };
  } catch (error) {
    console.error("Erreur dans createFriendRequestAction:", error);

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Une erreur inconnue est survenue",
    };
  }
}
