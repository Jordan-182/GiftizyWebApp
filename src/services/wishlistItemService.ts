import {
  ItemCreateData,
  wishlistItemRepository,
} from "@/repositories/wishlistItemRepository";
import type { UpdateWishlistItemInput } from "@/schemas";

export const wishlistItemService = {
  async deleteItem(itemId: string, wishlistId: string, userId: string) {
    const item = await wishlistItemRepository.getItemWithWishlist(itemId);

    if (!item) {
      throw new Error("Article introuvable");
    }

    if (item.wishlistId !== wishlistId) {
      throw new Error("L'article n'appartient pas à cette wishlist");
    }

    if (item.wishlist.userId !== userId) {
      throw new Error("Vous n'êtes pas autorisé à supprimer cet article");
    }

    const result = await wishlistItemRepository.deleteItem(itemId);
    if (!result) {
      throw new Error("Erreur lors de la suppression de l'article");
    }
    return result;
  },

  async addItemToWishlist(
    wishlistId: string,
    item: ItemCreateData,
    userId: string
  ) {
    // Vérification que la wishlist existe et appartient à l'utilisateur
    const wishlist = await wishlistItemRepository.getWishlistWithUser(
      wishlistId
    );

    if (!wishlist) {
      throw new Error("Wishlist introuvable");
    }

    if (wishlist.userId !== userId) {
      throw new Error(
        "Vous n'êtes pas autorisé à ajouter des articles à cette wishlist"
      );
    }

    // Validation des données
    if (!item.name?.trim()) {
      throw new Error("Le nom de l'article est obligatoire");
    }
    if (!item.description?.trim()) {
      throw new Error("La description de l'article est obligatoire");
    }
    if (item.price !== undefined && item.price < 0) {
      throw new Error("Le prix ne peut pas être négatif");
    }

    const result = await wishlistItemRepository.addItemToWishlist(
      wishlistId,
      item
    );

    if (!result) {
      throw new Error("Erreur lors de l'ajout de l'article");
    }

    return result;
  },

  async updateItem(
    itemId: string,
    wishlistId: string,
    item: UpdateWishlistItemInput,
    userId: string
  ) {
    // Vérification que l'item existe et appartient à l'utilisateur
    const existingItem = await wishlistItemRepository.getItemWithWishlist(
      itemId
    );

    if (!existingItem) {
      throw new Error("Article introuvable");
    }

    if (existingItem.wishlistId !== wishlistId) {
      throw new Error("L'article n'appartient pas à cette wishlist");
    }

    if (existingItem.wishlist.userId !== userId) {
      throw new Error("Vous n'êtes pas autorisé à modifier cet article");
    }

    // Validation des données (seulement si elles sont fournies pour l'update)
    if (item.name !== undefined && !item.name?.trim()) {
      throw new Error("Le nom de l'article ne peut pas être vide");
    }
    if (item.description !== undefined && !item.description?.trim()) {
      throw new Error("La description de l'article ne peut pas être vide");
    }
    if (item.price !== undefined && item.price < 0) {
      throw new Error("Le prix ne peut pas être négatif");
    }

    const result = await wishlistItemRepository.updateItem(itemId, item);

    if (!result) {
      throw new Error("Erreur lors de la mise à jour de l'article");
    }

    return result;
  },
};
