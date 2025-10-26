"use server";

import { auth } from "@/lib/auth";
import { UpdateWishlistWithIdSchema } from "@/schemas/wishlist.schema";
import { wishlistService } from "@/services/wishlistService";
import { revalidatePath, revalidateTag } from "next/cache";

export type UpdateWishlistState = {
  success: boolean;
  error?: string;
  message?: string;
  fieldErrors?: {
    name?: string;
    description?: string;
    profileId?: string;
  };
};

export async function updateWishlistAction(
  prevState: UpdateWishlistState,
  formData: FormData
): Promise<UpdateWishlistState> {
  try {
    // Vérifier l'authentification
    const session = await auth.api.getSession({
      headers: await import("next/headers").then((mod) => mod.headers()),
    });

    if (!session?.user?.id) {
      return {
        success: false,
        error: "Vous devez être connecté pour modifier une liste",
      };
    }

    // Extraire et valider les données du formulaire
    const rawData = {
      id: formData.get("id") as string,
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      profileId: formData.get("profileId") as string,
    };

    const validatedData = UpdateWishlistWithIdSchema.parse(rawData);

    // Appeler le service pour mettre à jour la wishlist
    await wishlistService.updateWishlist(
      validatedData.id,
      {
        name: validatedData.name,
        description: validatedData.description,
        profileId: validatedData.profileId,
      },
      session.user.id
    );

    // Invalider le cache des wishlists
    revalidateTag(`user-wishlists-${session.user.id}`);
    revalidateTag(`wishlist-${validatedData.id}`);
    revalidatePath("/wishlists");
    revalidatePath(`/wishlists/${validatedData.id}`);

    return {
      success: true,
      message: "Liste modifiée avec succès",
    };
  } catch (error) {
    console.error("Erreur lors de la modification de la wishlist:", error);

    // Gestion des erreurs de validation Zod
    if (error && typeof error === "object" && "issues" in error) {
      const zodError = error as {
        issues?: Array<{ path?: Array<string | number>; message: string }>;
      };
      const fieldErrors: UpdateWishlistState["fieldErrors"] = {};

      zodError.issues?.forEach((issue) => {
        const field = issue.path?.[0];
        if (field && typeof field === "string") {
          fieldErrors[field as keyof typeof fieldErrors] = issue.message;
        }
      });

      return {
        success: false,
        fieldErrors,
      };
    }

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Une erreur est survenue lors de la modification",
    };
  }
}
