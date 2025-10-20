import {
  ItemCreateData,
  wishlistItemRepository,
} from "@/repositories/wishlistItemRepository";

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

  async addItemToWishlist(wishlistId: string, item: ItemCreateData) {
    const result = await wishlistItemRepository.addItemToWishlist(
      wishlistId,
      item
    );
    if (!result) {
      throw new Error("Erreur lors de l'ajout' de l'article");
    }
    return result;
  },
};
