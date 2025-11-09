"use server";

import { auth } from "@/lib/auth";
import { profileRepository } from "@/repositories/profileRepository";
import {
  CreateEventSchema,
  DeleteEventSchema,
  UpdateEventWithIdSchema,
} from "@/schemas/event.schema";
import { eventService } from "@/services/eventService";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";

export type CreateEventState = {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
};

export type UpdateEventState = {
  success: boolean;
  error?: string;
  message?: string;
  fieldErrors?: {
    name?: string;
    description?: string;
    date?: string;
    location?: string;
    profileId?: string;
  };
};

export type DeleteEventState = {
  success: boolean;
  error?: string;
  message?: string;
  shouldRedirect?: boolean;
};

// Créer un événement
export async function createEventAction(
  _prevState: CreateEventState,
  formData: FormData
): Promise<CreateEventState> {
  try {
    // 1. Authentification
    const session = await auth.api.getSession({
      headers: await import("next/headers").then((mod) => mod.headers()),
    });
    if (!session) {
      return {
        success: false,
        error: "Non autorisé",
      };
    }

    // 2. Extraction et validation des données
    const profileIdRaw = formData.get("profileId") as string;
    const rawFormData = {
      name: formData.get("name") as string,
      description: (formData.get("description") as string) || "",
      date: formData.get("date") as string,
      location: (formData.get("location") as string) || "",
      hostId: session.user.id, // L'utilisateur connecté est l'hôte
      profileId: profileIdRaw === "none" ? "" : profileIdRaw || "",
    };

    // 3. Validation Zod
    const validatedData = CreateEventSchema.parse(rawFormData);

    // 4. Vérification que le profil appartient à l'utilisateur (si fourni)
    if (validatedData.profileId) {
      const userProfiles = await profileRepository.findByUserId(
        session.user.id
      );
      const profileExists = userProfiles.some(
        (profile) => profile.id === validatedData.profileId
      );

      if (!profileExists) {
        return {
          success: false,
          error: "Le profil sélectionné ne vous appartient pas",
        };
      }
    }

    // 5. Appel du service
    await eventService.createEvent(validatedData);

    // 6. Invalidation sélective du cache
    revalidateTag(`user-events-${session.user.id}`);
    revalidateTag("all-events");
    // Invalider aussi le cache des wishlists car une nouvelle wishlist d'événement a été créée
    revalidateTag(`user-wishlists-${session.user.id}`);
    revalidatePath("/wishlists");

    return { success: true };
  } catch (error) {
    // Gestion des erreurs Zod
    if (error instanceof z.ZodError) {
      const fieldErrors = error.issues.reduce((acc, issue) => {
        acc[issue.path.join(".")] = issue.message;
        return acc;
      }, {} as Record<string, string>);

      return {
        success: false,
        error: "Données invalides",
        fieldErrors,
      };
    }

    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Erreur lors de la création",
    };
  }
}

// Mettre à jour un événement
export async function updateEventAction(
  prevState: UpdateEventState,
  formData: FormData
): Promise<UpdateEventState> {
  try {
    // Vérifier l'authentification
    const session = await auth.api.getSession({
      headers: await import("next/headers").then((mod) => mod.headers()),
    });

    if (!session?.user?.id) {
      return {
        success: false,
        error: "Vous devez être connecté pour modifier un événement",
      };
    }

    // Extraire et valider les données du formulaire
    const profileIdRaw = formData.get("profileId") as string;
    const rawData = {
      id: formData.get("id") as string,
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      date: formData.get("date") as string,
      location: formData.get("location") as string,
      hostId: session.user.id,
      profileId: profileIdRaw === "none" ? "" : profileIdRaw || "",
    };

    const validatedData = UpdateEventWithIdSchema.parse(rawData);

    // Vérification que le profil appartient à l'utilisateur (si fourni)
    if (validatedData.profileId) {
      const userProfiles = await profileRepository.findByUserId(
        session.user.id
      );
      const profileExists = userProfiles.some(
        (profile) => profile.id === validatedData.profileId
      );

      if (!profileExists) {
        return {
          success: false,
          error: "Le profil sélectionné ne vous appartient pas",
        };
      }
    }

    // Appeler le service pour mettre à jour l'événement
    await eventService.updateEvent(
      validatedData.id,
      {
        name: validatedData.name,
        description: validatedData.description,
        date: validatedData.date,
        location: validatedData.location,
        hostId: validatedData.hostId,
        profileId: validatedData.profileId,
      },
      session.user.id
    );

    // Invalider le cache des événements
    revalidateTag(`user-events-${session.user.id}`);
    revalidateTag(`event-${validatedData.id}`);
    revalidateTag("all-events");
    revalidatePath("/events");
    revalidatePath(`/events/${validatedData.id}`);

    return {
      success: true,
      message: "Événement modifié avec succès",
    };
  } catch (error) {
    console.error("Erreur lors de la modification de l'événement:", error);

    // Gestion des erreurs de validation Zod
    if (error && typeof error === "object" && "issues" in error) {
      const zodError = error as {
        issues?: Array<{ path?: Array<string | number>; message: string }>;
      };
      const fieldErrors: UpdateEventState["fieldErrors"] = {};

      zodError.issues?.forEach((issue) => {
        const field = issue.path?.[0];
        if (field && typeof field === "string") {
          fieldErrors[field as keyof typeof fieldErrors] = issue.message;
        }
      });

      return {
        success: false,
        fieldErrors,
      };
    }

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Une erreur est survenue lors de la modification",
    };
  }
}

// Supprimer un événement
export async function deleteEventAction(
  prevState: DeleteEventState,
  formData: FormData
): Promise<DeleteEventState> {
  try {
    // Vérifier l'authentification
    const session = await auth.api.getSession({
      headers: await import("next/headers").then((mod) => mod.headers()),
    });

    if (!session?.user?.id) {
      return {
        success: false,
        error: "Vous devez être connecté pour supprimer un événement",
      };
    }

    // Valider les données du formulaire
    const rawData = {
      id: formData.get("id") as string,
    };

    const validatedData = DeleteEventSchema.parse(rawData);

    // Appeler le service pour supprimer l'événement
    await eventService.deleteEvent(validatedData.id, session.user.id);

    // Invalider le cache des événements et des wishlists
    revalidateTag(`user-events-${session.user.id}`);
    revalidateTag(`event-${validatedData.id}`);
    revalidateTag("all-events");
    // Invalider aussi le cache des wishlists car la wishlist d'événement a été supprimée
    revalidateTag(`user-wishlists-${session.user.id}`);
    revalidatePath("/events");
    revalidatePath(`/events/${validatedData.id}`);
    revalidatePath("/wishlists");

    return {
      success: true,
      message: "Événement et sa liste de cadeaux supprimés avec succès",
      shouldRedirect: true,
    };
  } catch (error) {
    console.error("Erreur lors de la suppression de l'événement:", error);

    // Gestion des erreurs de validation Zod
    if (error && typeof error === "object" && "issues" in error) {
      return {
        success: false,
        error: "Données invalides",
      };
    }

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Une erreur est survenue lors de la suppression",
    };
  }
}

// Obtenir tous les événements de l'utilisateur
export async function getUserEventsAction() {
  try {
    const session = await auth.api.getSession({
      headers: await import("next/headers").then((mod) => mod.headers()),
    });

    if (!session?.user?.id) {
      throw new Error("Non autorisé");
    }

    return await eventService.getEventsByUser(session.user.id);
  } catch (error) {
    console.error("Erreur lors de la récupération des événements:", error);
    throw error;
  }
}

// Obtenir un événement par ID
export async function getEventByIdAction(id: string) {
  try {
    const session = await auth.api.getSession({
      headers: await import("next/headers").then((mod) => mod.headers()),
    });

    if (!session?.user?.id) {
      throw new Error("Non autorisé");
    }

    return await eventService.getEventById(id);
  } catch (error) {
    console.error("Erreur lors de la récupération de l'événement:", error);
    throw error;
  }
}

export type InviteToEventState = {
  success: boolean;
  error?: string;
  message?: string;
};

export type RespondToEventInvitationState = {
  success: boolean;
  error?: string;
  message?: string;
};

// Inviter un ami à un événement
export async function inviteToEventAction(
  prevState: InviteToEventState,
  formData: FormData
): Promise<InviteToEventState> {
  try {
    const session = await auth.api.getSession({
      headers: await import("next/headers").then((mod) => mod.headers()),
    });

    if (!session?.user?.id) {
      return {
        success: false,
        error: "Vous devez être connecté pour inviter des amis",
      };
    }

    const eventId = formData.get("eventId") as string;
    const friendId = formData.get("friendId") as string;

    if (!eventId || !friendId) {
      return {
        success: false,
        error: "Données manquantes",
      };
    }

    await eventService.inviteToEvent(eventId, friendId, session.user.id);

    revalidateTag(`event-${eventId}`);
    revalidateTag(`user-events-${session.user.id}`);

    return {
      success: true,
      message: "Invitation envoyée avec succès",
    };
  } catch (error) {
    console.error("Erreur lors de l'invitation:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Erreur lors de l'envoi de l'invitation",
    };
  }
}

// Répondre à une invitation à un événement
export async function respondToEventInvitationAction(
  prevState: RespondToEventInvitationState,
  formData: FormData
): Promise<RespondToEventInvitationState> {
  try {
    const session = await auth.api.getSession({
      headers: await import("next/headers").then((mod) => mod.headers()),
    });

    if (!session?.user?.id) {
      return {
        success: false,
        error: "Vous devez être connecté pour répondre à une invitation",
      };
    }

    const eventId = formData.get("eventId") as string;
    const status = formData.get("status") as "ACCEPTED" | "DECLINED";

    if (!eventId || !status) {
      return {
        success: false,
        error: "Données manquantes",
      };
    }

    await eventService.respondToEventInvitation(
      eventId,
      session.user.id,
      status
    );

    revalidateTag(`event-${eventId}`);
    revalidateTag(`user-events-${session.user.id}`);

    return {
      success: true,
      message:
        status === "ACCEPTED" ? "Invitation acceptée" : "Invitation refusée",
    };
  } catch (error) {
    console.error("Erreur lors de la réponse à l'invitation:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Erreur lors de la réponse à l'invitation",
    };
  }
}

// Obtenir les invitations aux événements pour l'utilisateur connecté
export async function getEventInvitationsAction() {
  try {
    const session = await auth.api.getSession({
      headers: await import("next/headers").then((mod) => mod.headers()),
    });

    if (!session?.user?.id) {
      throw new Error("Non autorisé");
    }

    return await eventService.getEventInvitations(session.user.id);
  } catch (error) {
    console.error("Erreur lors de la récupération des invitations:", error);
    throw error;
  }
}

// Obtenir les événements des amis auxquels l'utilisateur a été invité et a accepté
export async function getFriendsEventsAction() {
  try {
    const session = await auth.api.getSession({
      headers: await import("next/headers").then((mod) => mod.headers()),
    });

    if (!session?.user?.id) {
      throw new Error("Non autorisé");
    }

    return await eventService.getFriendsEvents(session.user.id);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des événements des amis:",
      error
    );
    throw error;
  }
}

// Type pour la suppression d'invitation
export type RemoveInvitationState = {
  success: boolean;
  error?: string;
  message?: string;
};

// Supprimer une invitation à un événement
export async function removeInvitationAction(
  prevState: RemoveInvitationState,
  formData: FormData
): Promise<RemoveInvitationState> {
  try {
    const session = await auth.api.getSession({
      headers: await import("next/headers").then((mod) => mod.headers()),
    });

    if (!session?.user?.id) {
      return {
        success: false,
        error: "Vous devez être connecté pour supprimer une invitation",
      };
    }

    const eventId = formData.get("eventId") as string;
    const friendId = formData.get("friendId") as string;

    if (!eventId || !friendId) {
      return {
        success: false,
        error: "Données manquantes",
      };
    }

    // Vérifier que l'utilisateur est bien l'hôte de l'événement
    const event = await eventService.getEventById(eventId);
    if (!event || event.hostId !== session.user.id) {
      return {
        success: false,
        error: "Vous n'avez pas l'autorisation de supprimer cette invitation",
      };
    }

    await eventService.removeInvitation(eventId, friendId);

    revalidateTag(`event-${eventId}`);
    revalidateTag(`user-events-${session.user.id}`);

    return {
      success: true,
      message: "Invitation supprimée avec succès",
    };
  } catch (error) {
    console.error("Erreur lors de la suppression de l'invitation:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Erreur lors de la suppression de l'invitation",
    };
  }
}

// Type pour quitter un événement
export type LeaveEventState = {
  success: boolean;
  error?: string;
  message?: string;
  shouldRedirect?: boolean;
};

// Quitter un événement (pour un invité accepté)
export async function leaveEventAction(
  prevState: LeaveEventState,
  formData: FormData
): Promise<LeaveEventState> {
  try {
    const session = await auth.api.getSession({
      headers: await import("next/headers").then((mod) => mod.headers()),
    });

    if (!session?.user?.id) {
      return {
        success: false,
        error: "Vous devez être connecté pour quitter un événement",
      };
    }

    const eventId = formData.get("eventId") as string;

    if (!eventId) {
      return {
        success: false,
        error: "Données manquantes",
      };
    }

    // Vérifier que l'utilisateur a bien une invitation acceptée pour cet événement
    const event = await eventService.getEventById(eventId);
    if (!event) {
      return {
        success: false,
        error: "Événement non trouvé",
      };
    }

    const invitation = event.invitations.find(
      (inv) => inv.friendId === session.user.id && inv.status === "ACCEPTED"
    );

    if (!invitation) {
      return {
        success: false,
        error: "Vous n'êtes pas participant à cet événement",
      };
    }

    // Supprimer l'invitation (quitter l'événement)
    await eventService.removeInvitation(eventId, session.user.id);

    revalidateTag(`event-${eventId}`);
    revalidateTag(`user-events-${session.user.id}`);
    revalidateTag("all-events");

    return {
      success: true,
      message: "Vous avez quitté l'événement avec succès",
      shouldRedirect: true,
    };
  } catch (error) {
    console.error("Erreur lors de la sortie de l'événement:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Erreur lors de la sortie de l'événement",
    };
  }
}
