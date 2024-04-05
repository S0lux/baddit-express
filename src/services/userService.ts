import { APP_ERROR_CODE, HttpStatusCode } from "../constants/constant";
import { HttpException } from "../exception/httpError";
import { userRepository } from "../repositories/userRepository";

class userService {
  async updateUserAvatar(id: string, avatarUrl: string) {
    try {
      await userRepository.updateAvatar(id, avatarUrl);
    } catch {
      throw new HttpException(HttpStatusCode.INTERNAL_SERVER_ERROR, APP_ERROR_CODE.serverError);
    }
  }
}

export default new userService();
