import { z } from "zod";

// Schéma de base pour une wishlist
export const WishlistSchema = z.object({
  name: z
    .string()
    .min(1, "Le nom est obligatoire")
    .max(100, "Le nom est trop long"),
  description: z.string().max(500, "La description est trop longue").optional(),
  isEventWishlist: z.boolean().default(false),
  profileId: z.string().uuid("ID de profil invalide"),
});

// Schéma pour la création (POST)
export const CreateWishlistSchema = WishlistSchema;

// Schéma pour la mise à jour (PATCH) - tous les champs optionnels
export const UpdateWishlistSchema = WishlistSchema.partial();

// Schéma pour la mise à jour complète (PUT)
export const ReplaceWishlistSchema = WishlistSchema;

// Types TypeScript inférés
export type WishlistInput = z.infer<typeof WishlistSchema>;
export type CreateWishlistInput = z.infer<typeof CreateWishlistSchema>;
export type UpdateWishlistInput = z.infer<typeof UpdateWishlistSchema>;
export type ReplaceWishlistInput = z.infer<typeof ReplaceWishlistSchema>;
