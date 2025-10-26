import { wishlistRepository } from "@/repositories/wishlistRepository";
import type {
  CreateWishlistInput,
  UpdateWishlistInput,
} from "@/schemas/wishlist.schema";

export const wishlistService = {
  async createWishlist(data: CreateWishlistInput, userId: string) {
    // Validation des données métier
    if (!data.name?.trim()) {
      throw new Error("Le nom de la wishlist est obligatoire");
    }
    if (data.name.trim().length > 100) {
      throw new Error("Le nom ne peut pas dépasser 100 caractères");
    }
    if (data.description && data.description.length > 500) {
      throw new Error("La description ne peut pas dépasser 500 caractères");
    }

    // Vérification que le profil appartient à l'utilisateur
    // TODO: Ajouter vérification du profileId

    const result = await wishlistRepository.create({
      ...data,
      userId,
      isEventWishlist: false,
    });

    if (!result) {
      throw new Error("Erreur lors de la création de la wishlist");
    }

    return result;
  },
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

  async deleteWishlist(id: string, userId: string) {
    // Vérifier que la wishlist existe et appartient à l'utilisateur
    const wishlist = await wishlistRepository.findByIdWithUserId(id, userId);
    if (!wishlist) {
      throw new Error(
        "Liste non trouvée ou vous n'êtes pas autorisé à la supprimer"
      );
    }

    // Supprimer la wishlist (la suppression en cascade des items sera gérée par Prisma)
    const result = await wishlistRepository.delete(id);
    if (!result) {
      throw new Error("Erreur lors de la suppression de la liste");
    }

    return result;
  },

  async updateWishlist(id: string, data: UpdateWishlistInput, userId: string) {
    // Vérifier que la wishlist existe et appartient à l'utilisateur
    const existingWishlist = await wishlistRepository.findByIdWithUserId(
      id,
      userId
    );
    if (!existingWishlist) {
      throw new Error(
        "Liste non trouvée ou vous n'êtes pas autorisé à la modifier"
      );
    }

    // Validation des données métier si elles sont fournies
    if (data.name !== undefined) {
      if (!data.name?.trim()) {
        throw new Error("Le nom de la wishlist est obligatoire");
      }
      if (data.name.trim().length > 100) {
        throw new Error("Le nom ne peut pas dépasser 100 caractères");
      }
    }

    if (
      data.description !== undefined &&
      data.description &&
      data.description.length > 500
    ) {
      throw new Error("La description ne peut pas dépasser 500 caractères");
    }

    // Nettoyer les données (supprimer les champs vides et undefined)
    const cleanData: UpdateWishlistInput = {};
    if (data.name !== undefined) cleanData.name = data.name.trim();
    if (data.description !== undefined)
      cleanData.description = data.description || "";
    if (data.profileId !== undefined) cleanData.profileId = data.profileId;

    const result = await wishlistRepository.update(id, cleanData);
    if (!result) {
      throw new Error("Erreur lors de la mise à jour de la liste");
    }

    return result;
  },
};
