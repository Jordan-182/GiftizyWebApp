import { profileRepository } from "@/repositories/profileRepository";

export const profileService = {
  async getProfilesByUserId(userId: string) {
    const profiles = await profileRepository.findByUserId(userId);
    if (!profiles || profiles.length === 0) {
      throw new Error("Utilisateur non trouvé");
    }
    return profiles;
  },

  async deleteProfileById(id: string) {
    const result = await profileRepository.deleteProfile(id);
    if (!result) {
      throw new Error("Erreur lors de la suppression du profil");
    }
    return result;
  },
};
