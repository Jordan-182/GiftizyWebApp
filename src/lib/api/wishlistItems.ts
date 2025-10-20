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
