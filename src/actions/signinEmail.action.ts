"use server";

import { auth, ErrorCode } from "@/lib/auth";
import { APIError } from "better-auth/api";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function signInEmailAction(formData: FormData) {
  const email = String(formData.get("email"));
  if (!email) return { error: "Merci d'indiquer votre email" };

  const password = String(formData.get("password"));
  if (!password) return { error: "Merci d'indiquer votre mot de passe" };

  try {
    await auth.api.signInEmail({
      headers: await headers(),
      body: {
        email,
        password,
      },
    });
    return { error: null };
  } catch (error) {
    if (error instanceof APIError) {
      const errorCode = error.body ? (error.body.code as ErrorCode) : "UNKNOWN";

      switch (errorCode) {
        case "INVALID_PASSWORD":
          return { error: "Le mot de passe saisi est incorrect" };
        case "INVALID_EMAIL":
          return {
            error: "Cette adresse email n'est associée à aucun compte.",
          };
        case "INVALID_EMAIL_OR_PASSWORD":
          return {
            error: "Le mot de passe et/ou l'adresse email sont incorrects.",
          };
        case "PASSWORD_TOO_SHORT":
          return { error: "Le mot de passe est trop court." };
        case "EMAIL_NOT_VERIFIED":
          redirect("/auth/verify?error=email_not_verified");
        default:
          return {
            error:
              "Une erreur est survenue lors de la connexion, veuillez réessayer.",
          };
      }
    }
    return { error: "Erreur serveur" };
  }
}
