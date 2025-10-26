"use server";

import { auth } from "@/lib/auth";
import { wishlistItemService } from "@/services/wishlistItemService";
import { revalidateTag } from "next/cache";

export type ToggleReservationState = {
  success: boolean;
  reserved?: boolean;
  message?: string;
  error?: string;
};

export async function toggleItemReservationAction(
  itemId: string
): Promise<ToggleReservationState> {
  try {
    // 1. Authentification
    const session = await auth.api.getSession({
      headers: await import("next/headers").then((mod) => mod.headers()),
    });
    if (!session) {
      return {
        success: false,
        error: "Non autorisé",
      };
    }

    // 2. Appel du service
    const result = await wishlistItemService.toggleItemReservation(
      itemId,
      session.user.id
    );

    // 3. Invalidation du cache pour que les changements soient visibles
    revalidateTag("friends-wishlists");
    revalidateTag(`wishlist-${result.wishlistId}`);
    revalidateTag(`user-wishlists-${result.wishlistOwnerId}`);

    return {
      success: true,
      reserved: result.reserved,
      message: result.message,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur inconnue",
    };
  }
}
