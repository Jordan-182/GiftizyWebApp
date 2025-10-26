import { z } from "zod";

// Schéma de base pour un item de wishlist
export const WishlistItemSchema = z.object({
  name: z
    .string()
    .min(1, "Le nom est obligatoire")
    .max(100, "Le nom est trop long"),
  description: z
    .string()
    .min(1, "La description est obligatoire")
    .max(500, "La description est trop longue"),
  price: z.number().positive("Le prix doit être positif").optional(),
  url: z.string().url("URL invalide").optional().or(z.literal("")),
  image: z.string().url("URL d'image invalide").optional().or(z.literal("")),
});

// Schéma pour la création (POST) - tous les champs requis sauf optionnels
export const CreateWishlistItemSchema = WishlistItemSchema;

// Schéma pour la mise à jour (PATCH) - tous les champs optionnels
export const UpdateWishlistItemSchema = WishlistItemSchema.partial();

// Schéma pour la mise à jour complète (PUT) - identique à la création
export const ReplaceWishlistItemSchema = WishlistItemSchema;

// Schémas pour les IDs - plus permissif pour supporter les formats personnalisés
export const WishlistIdSchema = z.string().min(1, "ID de wishlist requis");
export const ItemIdSchema = z.string().min(1, "ID d'item requis");

// Schémas pour la suppression d'items
export const DeleteWishlistItemSchema = z.object({
  wishlistId: WishlistIdSchema,
  itemId: ItemIdSchema,
});

// Schéma pour la mise à jour d'items avec IDs
export const UpdateWishlistItemWithIdsSchema = z.object({
  wishlistId: WishlistIdSchema,
  itemId: ItemIdSchema,
  data: UpdateWishlistItemSchema,
});

// Types TypeScript inférés automatiquement
export type WishlistItemInput = z.infer<typeof WishlistItemSchema>;
export type CreateWishlistItemInput = z.infer<typeof CreateWishlistItemSchema>;
export type UpdateWishlistItemInput = z.infer<typeof UpdateWishlistItemSchema>;
export type ReplaceWishlistItemInput = z.infer<
  typeof ReplaceWishlistItemSchema
>;
export type DeleteWishlistItemInput = z.infer<typeof DeleteWishlistItemSchema>;
export type UpdateWishlistItemWithIdsInput = z.infer<
  typeof UpdateWishlistItemWithIdsSchema
>;
