import { friendRepository } from "@/repositories/friendsRepository";

export const friendService = {
  async getFriends(userId: string) {
    const friendships = await friendRepository.getFriends(userId);
    if (!friendships) {
      return "Aucun ami trouvé";
    }
    return friendships;
  },

  async getReceivedFriendRequests(userId: string) {
    const requests = await friendRepository.getReceivedFriendRequests(userId);
    if (!requests) {
      return "Aucune demande d'ami reçue";
    }
    return requests;
  },

  async getSentFriendRequests(userId: string) {
    const requests = await friendRepository.getSentFriendRequests(userId);
    if (!requests) {
      return "Aucune demande d'ami envoyée";
    }
    return requests;
  },
};
