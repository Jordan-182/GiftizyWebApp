"use server";

import { auth } from "@/lib/auth";
import { friendCodeSchema } from "@/schemas/user.schema";
import { userService } from "@/services/userService";
import { headers } from "next/headers";

export async function getUserByFriendCodeAction(friendCode: string) {
  try {
    // Vérification de l'authentification
    const headersList = await headers();
    const session = await auth.api.getSession({
      headers: headersList,
    });

    if (!session) {
      throw new Error("Non autorisé");
    }

    // Validation du code ami avec Zod
    const normalizedFriendCode = friendCode.trim().toUpperCase();
    const validationResult = friendCodeSchema.safeParse({ 
      friendCode: normalizedFriendCode 
    });

    if (!validationResult.success) {
      const errorMessage = validationResult.error.issues[0]?.message || "Code ami invalide";
      throw new Error(errorMessage);
    }

    // Récupération de l'utilisateur
    const user = await userService.getUserByFriendCode(normalizedFriendCode);
    
    return {
      success: true,
      data: user,
    };
  } catch (error) {
    console.error("Erreur dans getUserByFriendCodeAction:", error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : "Une erreur inconnue est survenue",
    };
  }
}