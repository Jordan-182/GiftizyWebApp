"use server";

import { auth } from "@/lib/auth";
import { CreateWishlistItemSchema } from "@/schemas";
import { wishlistItemService } from "@/services/wishlistItemService";
import { revalidateTag } from "next/cache";
import { z } from "zod";

export type AddWishlistItemState = {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
};

export async function addWishlistItemAction(
  wishlistId: string,
  _prevState: AddWishlistItemState,
  formData: FormData
): Promise<AddWishlistItemState> {
  try {
    // 1. Authentification (même logique que l'API)
    const session = await auth.api.getSession({
      headers: await import("next/headers").then((mod) => mod.headers()),
    });
    if (!session) {
      return {
        success: false,
        error: "Non autorisé",
      };
    }

    // 2. Extraction et validation des données
    const rawFormData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      price: formData.get("price") ? Number(formData.get("price")) : undefined,
      url: formData.get("url") as string | undefined,
      image: formData.get("image") as string | undefined,
    };

    // 3. Validation Zod (même schéma que l'API)
    const validatedData = CreateWishlistItemSchema.parse(rawFormData);

    // 4. Appel du service (MÊME LOGIQUE que l'API Route)
    await wishlistItemService.addItemToWishlist(
      wishlistId,
      validatedData,
      session.user.id
    );

    // 5. Invalidation sélective du cache
    revalidateTag(`wishlist-${wishlistId}`);
    revalidateTag(`user-wishlists-${session.user.id}`);

    return { success: true };
  } catch (error) {
    // Gestion des erreurs Zod (même logique que l'API)
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
      error: error instanceof Error ? error.message : "Erreur inconnue",
    };
  }
}
