import { wishlistRepository } from "@/repositories/wishlistRepository";

export const wishlistService = {
  async getWishlistsByUser(userId: string) {
    const wishlists = await wishlistRepository.findByUser(userId);
    if (!wishlists) {
      throw new Error("Aucune liste trouvée");
    }
    return wishlists;
  },

  async getWishlistById(id: string) {
    const wishlist = await wishlistRepository.findById(id);
    if (!wishlist) {
      throw new Error("Aucune liste trouvée");
    }
    return wishlist;
  },
};
