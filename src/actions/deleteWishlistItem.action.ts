"use server";

import { auth } from "@/lib/auth";
import { DeleteWishlistItemSchema } from "@/schemas/wishlistItem.schema";
import { wishlistItemService } from "@/services/wishlistItemService";
import { revalidateTag } from "next/cache";
import { z } from "zod";

export type DeleteWishlistItemState = {
  success: boolean;
  error?: string;
};

export async function deleteWishlistItemAction(
  wishlistId: string,
  itemId: string
): Promise<DeleteWishlistItemState> {
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

    // 2. Validation des IDs
    const validatedData = DeleteWishlistItemSchema.parse({
      wishlistId,
      itemId,
    });

    // 3. Suppression via le service (même logique que l'API)
    await wishlistItemService.deleteItem(
      validatedData.itemId,
      validatedData.wishlistId,
      session.user.id
    );

    // 4. Invalidation sélective du cache
    revalidateTag(`wishlist-${validatedData.wishlistId}`);
    revalidateTag(`user-wishlists-${session.user.id}`);

    return { success: true };
  } catch (error) {
    // Gestion des erreurs Zod
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "IDs invalides",
      };
    }

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Erreur lors de la suppression",
    };
  }
}
