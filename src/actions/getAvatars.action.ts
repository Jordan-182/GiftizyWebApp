"use server";

import { avatarService } from "@/services/avatarService";
import { cache } from "react";

export const getAvatarsAction = cache(async () => {
  try {
    const avatars = await avatarService.getAll();
    return avatars;
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : "Erreur lors de la récupération des avatars"
    );
  }
});
