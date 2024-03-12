import { userRepository } from "../repositories/userRepository";

class userService {
  async updateUserAvatar(id: string, avatarUrl: string) {
    try {
      await userRepository.updateAvatar(id, avatarUrl);
    } catch {
      throw {
        status: 500,
        code: "DATABASE_ERROR",
        message: "Error updating user avatar.",
      };
    }
  }
}

export default new userService();
