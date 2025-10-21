import type { CreateWishlistItemInput } from "@/schemas";

export async function addWishlistItem(
  wishlistId: string,
  item: CreateWishlistItemInput
) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/wishlists/${wishlistId}/items`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(item),
    }
  );

  if (!res.ok) {
    const errorData = await res.json();

    // Gestion spécifique des erreurs de validation
    if (res.status === 400 && errorData.details) {
      const fieldErrors = errorData.details
        .map(
          (detail: { field: string; message: string }) =>
            `${detail.field}: ${detail.message}`
        )
        .join(", ");
      throw new Error(`Données invalides - ${fieldErrors}`);
    }

    throw new Error(errorData.error || "Erreur lors de l'ajout de l'article");
  }

  return res.json();
}

export async function deleteWishlistItem(wishlistId: string, itemId: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/wishlists/${wishlistId}/items/${itemId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(
      errorData.error || "Erreur lors de la suppression de l'article"
    );
  }

  return res.json();
}
