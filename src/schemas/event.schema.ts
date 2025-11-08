import { z } from "zod";

// Schéma de base pour un event
export const EventSchema = z.object({
  name: z
    .string()
    .min(1, "Le nom est obligatoire")
    .max(100, "Le nom est trop long"),
  description: z
    .string()
    .max(1000, "La description est trop longue")
    .optional()
    .or(z.literal("")),
  date: z.string().refine((s) => !Number.isNaN(Date.parse(s)), {
    message: "La date est invalide",
  }),
  location: z
    .string()
    .max(200, "L'emplacement est trop long")
    .optional()
    .or(z.literal("")),
  hostId: z.string().min(1, "L'hôte est obligatoire"),
  profileId: z.string().optional().or(z.literal("")),
});

// Schéma pour la création (POST)
export const CreateEventSchema = EventSchema;

// Schéma pour la mise à jour (PATCH) - tous les champs optionnels
export const UpdateEventSchema = EventSchema.partial();

// Schéma pour la mise à jour complète (PUT)
export const ReplaceEventSchema = EventSchema;

// Schéma pour la suppression (DELETE)
export const DeleteEventSchema = z.object({
  id: z.string().min(1, "L'ID est obligatoire"),
});

// Schéma pour la mise à jour avec ID (pour les server actions)
export const UpdateEventWithIdSchema = UpdateEventSchema.extend({
  id: z.string().min(1, "L'ID est obligatoire"),
});

// Types TypeScript inférés
export type EventInput = z.infer<typeof EventSchema>;
export type CreateEventInput = z.infer<typeof CreateEventSchema>;
export type UpdateEventInput = z.infer<typeof UpdateEventSchema>;
export type UpdateEventWithIdInput = z.infer<typeof UpdateEventWithIdSchema>;
export type ReplaceEventInput = z.infer<typeof ReplaceEventSchema>;
export type DeleteEventInput = z.infer<typeof DeleteEventSchema>;
