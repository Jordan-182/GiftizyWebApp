import { userRepository } from "@/repositories/userRepository";

export const userService = {
  async getUserById(id: string) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new Error("Utilisateur non trouvé");
    }
    return user;
  },
};
