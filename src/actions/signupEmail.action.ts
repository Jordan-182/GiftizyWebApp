"use server";

import { auth, ErrorCode } from "@/lib/auth";
import { APIError } from "better-auth/api";

export async function signUpEmailAction(formData: FormData) {
  const name = String(formData.get("name"));
  if (!name) return { error: "Merci d'indiquer votre nom" };

  const birthDateStr = String(formData.get("birthDate"));
  if (!birthDateStr)
    return { error: "Merci d'indiquer votre date de naissance" };

  const birthDate = new Date(birthDateStr);
  if (isNaN(birthDate.getTime()))
    return { error: "Date de naissance invalide" };

  const email = String(formData.get("email"));
  if (!email) return { error: "Merci d'indiquer votre email" };

  const password = String(formData.get("password"));
  if (!password) return { error: "Merci d'indiquer votre mot de passe" };

  const avatarId = "cl2k5a8q00001x0u7d9a7p8z3";
  try {
    await auth.api.signUpEmail({
      body: {
        name,
        birthDate,
        email,
        password,
        avatarId,
      },
    });
    return { error: null };
  } catch (error) {
    if (error instanceof APIError) {
      const errorCode = error.body ? (error.body.code as ErrorCode) : "UNKNOWN";

      switch (errorCode) {
        case "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL":
          return { error: "Cette adresse email est déjà utilisée." };
        case "USER_ALREADY_EXISTS":
          return { error: "Cette adresse email est déjà utilisée." };
        case "PASSWORD_TOO_SHORT":
          return { error: "Le mot de passe est trop court." };
        case "INVALID_DOMAIN":
          return {
            error:
              "Domaine invalide, merci d'utiliser une adresse email valide.",
          };
        default:
          return {
            error:
              "Une erreur est survenue lors de la création du compte, veuillez réessayer.",
          };
      }
    }
    return { error: "Erreur serveur" };
  }
}
