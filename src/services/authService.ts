import { APP_ERROR_CODE, HttpStatusCode } from "../constants/constant";
import { HttpException } from "../exception/httpError";
import { userRepository } from "../repositories/userRepository";
import { generateHash } from "../utils/hashFunctions";

class authService {
  // IMPORTANT
  // If you are looking for the login method, it is handled by PassportJS in the controller

  async register(userData: { username: string; password: string; email: string }) {
    const hashedPassword = generateHash(userData.password);
    const data = {
      username: userData.username,
      email: userData.email,
      hashedPassword: hashedPassword,
    };

    const user = await userRepository.getUserByUsername(data.username);
    if (user) {
      throw new HttpException(HttpStatusCode.CONFLICT, APP_ERROR_CODE.usernameTaken);
    }

    const emailUser = await userRepository.getUserByUsername(data.email);
    if (emailUser) {
      throw new HttpException(HttpStatusCode.CONFLICT, APP_ERROR_CODE.emailTaken);
    }

    const newUser = await userRepository.createUser(data);
    return newUser;
  }
}

export default new authService();
