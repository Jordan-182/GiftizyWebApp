"use server";

import { auth } from "@/lib/auth";
import {
  ItemIdSchema,
  UpdateWishlistItemSchema,
  WishlistIdSchema,
} from "@/schemas/wishlistItem.schema";
import { wishlistItemService } from "@/services/wishlistItemService";
import { revalidateTag } from "next/cache";
import { z } from "zod";

export type UpdateWishlistItemState = {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
};

export async function updateWishlistItemAction(
  wishlistId: string,
  itemId: string,
  _prevState: UpdateWishlistItemState,
  formData: FormData
): Promise<UpdateWishlistItemState> {
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
    const validatedWishlistId = WishlistIdSchema.parse(wishlistId);
    const validatedItemId = ItemIdSchema.parse(itemId);

    // 3. Extraction et validation des données du formulaire
    const rawFormData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      price: formData.get("price") ? Number(formData.get("price")) : undefined,
      url: formData.get("url") ? (formData.get("url") as string) : "",
      image: formData.get("image") ? (formData.get("image") as string) : "",
    };

    // 4. Validation Zod des données
    const validatedData = UpdateWishlistItemSchema.parse(rawFormData);

    // 5. Appel du service
    await wishlistItemService.updateItem(
      validatedItemId,
      validatedWishlistId,
      validatedData,
      session.user.id
    );

    // 6. Invalidation sélective du cache
    revalidateTag(`wishlist-${validatedWishlistId}`);
    revalidateTag(`user-wishlists-${session.user.id}`);

    return { success: true };
  } catch (error) {
    // Gestion des erreurs Zod
    if (error instanceof z.ZodError) {
      const fieldErrors = error.issues.reduce((acc, issue) => {
        acc[issue.path.join(".")] = issue.message;
        return acc;
      }, {} as Record<string, string>);

      return {
        success: false,
        error: "Données invalides",
        fieldErrors,
      };
    }

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Erreur lors de la mise à jour",
    };
  }
}
