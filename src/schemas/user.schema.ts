import { z } from "zod";

export const friendCodeSchema = z.object({
  friendCode: z
    .string()
    .min(1, "Le code ami est requis")
    .length(6, "Le code ami doit contenir exactement 6 caractères")
    .regex(
      /^[A-Z0-9]{6}$/,
      "Le code ami doit contenir uniquement des lettres majuscules et des chiffres"
    ),
});

export const friendshipIdSchema = z.object({
  friendshipId: z
    .string()
    .min(1, "L'ID de l'amitié est requis")
    .cuid("L'ID de l'amitié doit être un CUID valide"),
});

export const createFriendRequestSchema = z.object({
  friendId: z
    .string()
    .min(1, "L'ID de l'ami est requis")
    .uuid("L'ID de l'ami doit être un UUID valide"),
});

export const updateFriendRequestSchema = z.object({
  friendshipId: z
    .string()
    .min(1, "L'ID de l'amitié est requis")
    .cuid("L'ID de l'amitié doit être un CUID valide"),
  accept: z.boolean({
    message: "La décision d'acceptation doit être un booléen",
  }),
});

export const checkFriendshipStatusSchema = z.object({
  userId: z
    .string()
    .min(1, "L'ID de l'utilisateur est requis")
    .uuid("L'ID de l'utilisateur doit être un UUID valide"),
});

export type FriendCodeInput = z.infer<typeof friendCodeSchema>;
export type FriendshipIdInput = z.infer<typeof friendshipIdSchema>;
export type CreateFriendRequestInput = z.infer<
  typeof createFriendRequestSchema
>;
export type UpdateFriendRequestInput = z.infer<
  typeof updateFriendRequestSchema
>;
export type CheckFriendshipStatusInput = z.infer<
  typeof checkFriendshipStatusSchema
>;
