import { eventRepository } from "@/repositories/eventRepository";
import type {
  CreateEventInput,
  UpdateEventInput,
} from "@/schemas/event.schema";

export const eventService = {
  async getAll() {
    const events = await eventRepository.findAll();
    if (!events) {
      throw new Error("Aucun évènement trouvé");
    }
    return events;
  },

  async createEvent(data: CreateEventInput) {
    // Validation des données métier
    if (!data.name?.trim()) {
      throw new Error("Le nom de l'événement est obligatoire");
    }
    if (data.name.trim().length > 100) {
      throw new Error("Le nom ne peut pas dépasser 100 caractères");
    }
    if (data.description && data.description.length > 1000) {
      throw new Error("La description ne peut pas dépasser 1000 caractères");
    }
    if (data.location && data.location.length > 200) {
      throw new Error("L'emplacement ne peut pas dépasser 200 caractères");
    }

    // Vérifier que la date n'est pas dans le passé
    const eventDate = new Date(data.date);
    const now = new Date();
    if (eventDate < now) {
      throw new Error("La date de l'événement ne peut pas être dans le passé");
    }

    try {
      const result = await eventRepository.create(data);

      if (!result) {
        throw new Error("Erreur lors de la création de l'événement");
      }

      return result;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Erreur lors de la création de l'événement et de sa wishlist"
      );
    }
  },

  async getEventsByUser(userId: string) {
    const events = await eventRepository.findByUser(userId);
    if (!events) {
      throw new Error("Aucun événement trouvé");
    }
    return events;
  },

  async getEventById(id: string) {
    const event = await eventRepository.findById(id);
    if (!event) {
      throw new Error("Événement non trouvé");
    }
    return event;
  },

  async updateEvent(
    id: string,
    data: Partial<UpdateEventInput>,
    userId: string
  ) {
    // Vérifier que l'événement appartient à l'utilisateur
    const existingEvent = await eventRepository.findByIdAndUser(id, userId);
    if (!existingEvent) {
      throw new Error(
        "Événement non trouvé ou vous n'avez pas les droits pour le modifier"
      );
    }

    // Validation des données métier
    if (data.name !== undefined) {
      if (!data.name?.trim()) {
        throw new Error("Le nom de l'événement est obligatoire");
      }
      if (data.name.trim().length > 100) {
        throw new Error("Le nom ne peut pas dépasser 100 caractères");
      }
    }
    if (data.description && data.description.length > 1000) {
      throw new Error("La description ne peut pas dépasser 1000 caractères");
    }
    if (data.location && data.location.length > 200) {
      throw new Error("L'emplacement ne peut pas dépasser 200 caractères");
    }

    // Vérifier que la date n'est pas dans le passé (si fournie)
    if (data.date) {
      const eventDate = new Date(data.date);
      const now = new Date();
      if (eventDate < now) {
        throw new Error(
          "La date de l'événement ne peut pas être dans le passé"
        );
      }
    }

    const result = await eventRepository.update(id, data);

    if (!result) {
      throw new Error("Erreur lors de la mise à jour de l'événement");
    }

    return result;
  },

  async deleteEvent(id: string, userId: string) {
    // Vérifier que l'événement appartient à l'utilisateur
    const existingEvent = await eventRepository.findByIdAndUser(id, userId);
    if (!existingEvent) {
      throw new Error(
        "Événement non trouvé ou vous n'avez pas les droits pour le supprimer"
      );
    }

    const result = await eventRepository.delete(id);

    if (!result) {
      throw new Error("Erreur lors de la suppression de l'événement");
    }

    return result;
  },

  async inviteToEvent(eventId: string, friendId: string, hostId: string) {
    // Vérifier que l'événement appartient à l'utilisateur
    const event = await eventRepository.findByIdAndUser(eventId, hostId);
    if (!event) {
      throw new Error(
        "Événement non trouvé ou vous n'avez pas les droits pour inviter des personnes"
      );
    }

    // Vérifier si l'invitation existe déjà
    const existingInvitation = await eventRepository.findInvitation(
      eventId,
      friendId
    );
    if (existingInvitation) {
      throw new Error("Cette personne a déjà été invitée à cet événement");
    }

    // Vérifier que l'utilisateur n'essaie pas de s'inviter lui-même
    if (hostId === friendId) {
      throw new Error("Vous ne pouvez pas vous inviter vous-même");
    }

    const result = await eventRepository.createInvitation(eventId, friendId);
    if (!result) {
      throw new Error("Erreur lors de l'envoi de l'invitation");
    }

    return result;
  },

  async respondToEventInvitation(
    eventId: string,
    userId: string,
    status: "ACCEPTED" | "DECLINED"
  ) {
    // Vérifier que l'invitation existe
    const invitation = await eventRepository.findInvitation(eventId, userId);
    if (!invitation) {
      throw new Error("Invitation non trouvée");
    }

    if (invitation.status !== "PENDING") {
      throw new Error("Vous avez déjà répondu à cette invitation");
    }

    const result = await eventRepository.updateInvitationStatus(
      eventId,
      userId,
      status
    );
    if (!result) {
      throw new Error("Erreur lors de la réponse à l'invitation");
    }

    return result;
  },

  async getEventInvitations(userId: string) {
    const invitations = await eventRepository.findInvitationsByUser(userId);
    return invitations || [];
  },

  async getFriendsEvents(userId: string) {
    const events = await eventRepository.findFriendsEvents(userId);
    return events || [];
  },

  async removeInvitation(eventId: string, friendId: string) {
    // Vérifier que l'invitation existe
    const invitation = await eventRepository.findInvitation(eventId, friendId);
    if (!invitation) {
      throw new Error("Invitation non trouvée");
    }

    // Supprimer l'invitation
    const result = await eventRepository.deleteInvitation(eventId, friendId);
    return result;
  },

  async getCommonEvents(userId1: string, userId2: string) {
    const events = await eventRepository.findCommonEvents(userId1, userId2);
    return events || [];
  },
};
