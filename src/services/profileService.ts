import { prisma } from "@/lib/prisma";
import type { ProfileFormData } from "@/repositories/profileRepository";
import { profileRepository } from "@/repositories/profileRepository";

export const profileService = {
  async getProfilesByfriendCode(friendCode: string) {
    // Vérifier d'abord que l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { friendCode },
      select: { id: true },
    });

    if (!user) {
      throw new Error("Utilisateur non trouvé");
    }

    const profiles = await profileRepository.findByfriendCode(friendCode);
    return profiles || [];
  },

  async deleteProfileById(id: string) {
    const result = await profileRepository.deleteProfile(id);
    if (!result) {
      throw new Error("Erreur lors de la suppression du profil");
    }
    return result;
  },

  async createProfile(profile: ProfileFormData) {
    // Récupérer l'userId à partir du friendCode
    const user = await prisma.user.findUnique({
      where: { friendCode: profile.friendCode },
      select: { id: true },
    });

    if (!user) {
      throw new Error("Utilisateur non trouvé");
    }

    const profileWithUserId = {
      ...profile,
      userId: user.id,
    };

    const result = await profileRepository.createProfile(profileWithUserId);
    if (!result) {
      throw new Error("Erreur lors de la création du profil");
    }
    return result;
  },

  async editProfile(id: string, updatedProfile: ProfileFormData) {
    // Récupérer l'userId à partir du friendCode
    const user = await prisma.user.findUnique({
      where: { friendCode: updatedProfile.friendCode },
      select: { id: true },
    });

    if (!user) {
      throw new Error("Utilisateur non trouvé");
    }

    const profileWithUserId = {
      ...updatedProfile,
      userId: user.id,
    };

    const result = await profileRepository.editProfile(id, profileWithUserId);
    if (!result) {
      throw new Error("Erreur lors de la modification du profil");
    }
    return result;
  },
};
