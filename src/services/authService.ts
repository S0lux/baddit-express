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
    const data = {
      username: userData.username,
      email: userData.email,
      hashedPassword: hashedPassword,
    };

    const newUser = userRepository.createUser(data);

    if (!newUser)
      throw {
        code: "BAD_CREDETIALS",
        message: "Email or username is already taken.",
      };
  }
}

export default new authService();
