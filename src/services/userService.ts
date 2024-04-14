import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
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

  async getUserById(id: string) {
    try {
      return await userRepository.getUserById(id);
    } catch {
      throw new HttpException(HttpStatusCode.INTERNAL_SERVER_ERROR, APP_ERROR_CODE.serverError);
    }
  }

  async updatePassword(userId: string, newPassword: string) {
    try {
      await userRepository.updatePassword(userId, newPassword);
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === "P2016") {
          throw new HttpException(HttpStatusCode.NOT_FOUND, APP_ERROR_CODE.userNotFound);
        }
      }
      throw new HttpException(HttpStatusCode.INTERNAL_SERVER_ERROR, APP_ERROR_CODE.serverError);
    }
  }
}

export default new userService();
