import { avatarRepository } from "@/repositories/avatarRepository";

export const avatarService = {
  async getAll() {
    const avatars = await avatarRepository.findAll();
    if (!avatars) {
      throw new Error("Aucun avatar trouvé");
    }
    return avatars;
  },
};
