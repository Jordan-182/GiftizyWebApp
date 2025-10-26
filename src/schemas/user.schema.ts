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

export type FriendCodeInput = z.infer<typeof friendCodeSchema>;
