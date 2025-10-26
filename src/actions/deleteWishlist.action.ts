"use server";

import { auth } from "@/lib/auth";
import { DeleteWishlistSchema } from "@/schemas/wishlist.schema";
import { wishlistService } from "@/services/wishlistService";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

export type DeleteWishlistState = {
  success: boolean;
  error?: string;
  message?: string;
  shouldRedirect?: boolean;
};

export async function deleteWishlistAction(
  prevState: DeleteWishlistState,
  formData: FormData
): Promise<DeleteWishlistState> {
  try {
    // Vérifier l'authentification
    const session = await auth.api.getSession({
      headers: await import("next/headers").then((mod) => mod.headers()),
    });

    if (!session?.user?.id) {
      return {
        success: false,
        error: "Vous devez être connecté pour supprimer une liste",
      };
    }

    // Valider les données du formulaire
    const rawData = {
      id: formData.get("id") as string,
    };

    const validatedData = DeleteWishlistSchema.parse(rawData);

    // Appeler le service pour supprimer la wishlist
    await wishlistService.deleteWishlist(validatedData.id, session.user.id);

    // Invalider le cache des wishlists avec le bon tag et revalider les chemins
    revalidateTag(`user-wishlists-${session.user.id}`);
    revalidateTag(`wishlist-${validatedData.id}`);
    revalidatePath("/wishlists");
    revalidatePath(`/wishlists/${validatedData.id}`);

    return {
      success: true,
      message: "Liste supprimée avec succès",
    };
  } catch (error) {
    console.error("Erreur lors de la suppression de la wishlist:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Une erreur est survenue lors de la suppression",
    };
  }
}

// Action spécifique pour la suppression avec redirection (depuis la page détail)
export async function deleteWishlistWithRedirectAction(formData: FormData) {
  try {
    // Vérifier l'authentification
    const session = await auth.api.getSession({
      headers: await import("next/headers").then((mod) => mod.headers()),
    });

    if (!session?.user?.id) {
      throw new Error("Vous devez être connecté pour supprimer une liste");
    }

    // Valider les données du formulaire
    const rawData = {
      id: formData.get("id") as string,
    };

    const validatedData = DeleteWishlistSchema.parse(rawData);

    // Appeler le service pour supprimer la wishlist
    await wishlistService.deleteWishlist(validatedData.id, session.user.id);

    // Invalider le cache des wishlists avec le bon tag et revalider les chemins
    revalidateTag(`user-wishlists-${session.user.id}`);
    revalidateTag(`wishlist-${validatedData.id}`);
    revalidatePath("/wishlists");
    revalidatePath(`/wishlists/${validatedData.id}`);

    // Rediriger côté serveur
    redirect("/wishlists");
  } catch (error) {
    console.error("Erreur lors de la suppression de la wishlist:", error);
    throw error;
  }
}
