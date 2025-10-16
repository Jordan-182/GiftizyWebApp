import { userRepository } from "@/repositories/userRepository";

export const userService = {
  async getUserByFriendCode(friendCode: string) {
    const user = await userRepository.findByFriendCode(friendCode);
    if (!user) {
      throw new Error("Utilisateur non trouvé");
    }
    return user;
  },
};
