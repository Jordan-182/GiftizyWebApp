import { z } from "zod";

// Schéma de base pour une wishlist
export const WishlistSchema = z.object({
  name: z
    .string()
    .min(1, "Le nom est obligatoire")
    .max(100, "Le nom est trop long"),
  description: z
    .string()
    .max(500, "La description est trop longue")
    .optional()
    .or(z.literal("")),
  isEventWishlist: z.boolean().default(false),
  profileId: z.string().min(1, "Le profil est obligatoire"),
});

// Schéma pour la création (POST)
export const CreateWishlistSchema = WishlistSchema;

// Schéma pour la mise à jour (PATCH) - tous les champs optionnels
export const UpdateWishlistSchema = WishlistSchema.partial();

// Schéma pour la mise à jour complète (PUT)
export const ReplaceWishlistSchema = WishlistSchema;

// Schéma pour la suppression (DELETE)
export const DeleteWishlistSchema = z.object({
  id: z.string().min(1, "L'ID est obligatoire"),
});

// Schéma pour la mise à jour avec ID (pour les server actions)
export const UpdateWishlistWithIdSchema = UpdateWishlistSchema.extend({
  id: z.string().min(1, "L'ID est obligatoire"),
});

// Types TypeScript inférés
export type WishlistInput = z.infer<typeof WishlistSchema>;
export type CreateWishlistInput = z.infer<typeof CreateWishlistSchema>;
export type UpdateWishlistInput = z.infer<typeof UpdateWishlistSchema>;
export type UpdateWishlistWithIdInput = z.infer<
  typeof UpdateWishlistWithIdSchema
>;
export type ReplaceWishlistInput = z.infer<typeof ReplaceWishlistSchema>;
export type DeleteWishlistInput = z.infer<typeof DeleteWishlistSchema>;
