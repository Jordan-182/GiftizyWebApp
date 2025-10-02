"use server";

import { auth } from "@/lib/auth";
import { APIError } from "better-auth/api";
import { headers } from "next/headers";

export async function changePasswordAction(formData: FormData) {
  const currentPassword = String(formData.get("currentPassword"));
  if (!currentPassword)
    return { error: "Veuillez entrer votre mot de passe actuel" };

  const newPassword = String(formData.get("newPassword"));
  if (!newPassword)
    return { error: "Veuillez entrer votre nouveau mot de passe" };

  try {
    await auth.api.changePassword({
      headers: await headers(),
      body: {
        currentPassword,
        newPassword,
      },
    });
    return { error: null };
  } catch (error) {
    if (error instanceof APIError) {
      return { error: error.message };
    }
    return { error: "Erreur serveur." };
  }
}
