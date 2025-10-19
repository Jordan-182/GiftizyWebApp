import { friendRepository } from "@/repositories/friendsRepository";

export const friendService = {
  async getFriends(userId: string) {
    const friendships = await friendRepository.getFriends(userId);
    if (!friendships || friendships.length === 0) {
      return [];
    }
    return friendships;
  },

  async getPendingFriendRequests(userId: string) {
    const requests = await friendRepository.getPendingFriendRequests(userId);
    if (!requests || requests.length === 0) {
      return [];
    }
    return requests;
  },

  async createFriendRequest(userId: string, friendId: string) {
    const friend = await friendRepository.findByFriendCode(friendId);
    if (!friend) {
      throw new Error("Utilisateur introuvable avec ce code ami");
    }

    if (friend.id === userId) {
      throw new Error("Vous ne pouvez pas vous ajouter vous-même");
    }

    const existingFriendship = await friendRepository.findExistingFriendship(
      userId,
      friend.id
    );
    if (existingFriendship) {
      throw new Error("Une demande d'amitié existe déjà avec cet utilisateur");
    }

    const newRequest = await friendRepository.createFriendRequest(
      userId,
      friend.id
    );
    if (!newRequest) {
      throw new Error("Erreur lors de l'envoi de la demande d'amitié");
    }
    return newRequest;
  },

  async updateFriendRequest(friendshipId: string, accept: boolean) {
    const updatedRequest = await friendRepository.updateFriendRequest(
      friendshipId,
      accept
    );
    if (!updatedRequest) {
      return "Erreur lors de la réponse à la demande d'amitié";
    }
    return updatedRequest;
  },

  async deleteFriendship(friendshipId: string) {
    const deletedFriendship = await friendRepository.deleteFriendship(
      friendshipId
    );
    if (!deletedFriendship) {
      return "Erreur lors de la suppression de l'amitié";
    }
    return deletedFriendship;
  },

  async checkFriendshipStatus(currentUserId: string, targetUserId: string) {
    // Si c'est le même utilisateur
    if (currentUserId === targetUserId) {
      return { status: "self" };
    }

    // Vérifier s'il y a une amitié existante
    const existingFriendship = await friendRepository.findExistingFriendship(
      currentUserId,
      targetUserId
    );

    if (!existingFriendship) {
      return { status: "none" }; // Aucune relation
    }

    if (existingFriendship.status === "ACCEPTED") {
      return {
        status: "friend",
        friendshipId: existingFriendship.id,
      };
    }

    if (existingFriendship.status === "PENDING") {
      // Vérifier qui a envoyé la demande
      if (existingFriendship.senderId === currentUserId) {
        return {
          status: "pending_sent",
          friendshipId: existingFriendship.id,
        };
      } else {
        return {
          status: "pending_received",
          friendshipId: existingFriendship.id,
        };
      }
    }

    return { status: "none" };
  },
};
