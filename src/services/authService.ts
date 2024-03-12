import { userRepository } from "../repositories/userRepository";
import { generateHash } from "../utils/hashFunctions";

class authService {
  // IMPORTANT
  // If you are looking for the login method, it is handled by PassportJS in the controller

  async register(userData: {
    username: string;
    password: string;
    email: string;
  }) {
    const hashedPassword = generateHash(userData.password);

    userRepository
      .createUser({ ...userData, hashedPassword: hashedPassword })
      .catch((error) => {
        // Stupid I know
        throw {
          code: "BAD_CREDETIALS",
          message: "Email or username is already taken.",
        };
      });
  }
}

export default new authService();
