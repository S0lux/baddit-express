import { sesClient } from "../config/ses";
import randomstring from "randomstring";
import { userRepository } from "../repositories/userRepository";
import { SendEmailCommand } from "@aws-sdk/client-ses";
import { generateVerificationEmail } from "../templates/verificationEmail";
import { HttpException } from "../exception/httpError";
import { APP_ERROR_CODE, HttpStatusCode } from "../constants/constant";

class emailService {
  async sendVerificationEmail(userId: string) {
    const user = await userRepository.getUserById(userId);

    if (!user) {
      throw new HttpException(HttpStatusCode.NOT_FOUND, APP_ERROR_CODE.userNotFound);
    }

    const token = randomstring.generate();
    const expireAt = new Date().setMinutes(new Date().getMinutes() + 1440); // a day

    try {
      const emailToken = await userRepository.addEmailToken(userId, token, new Date(expireAt));
    } catch {
      throw new HttpException(HttpStatusCode.INTERNAL_SERVER_ERROR, APP_ERROR_CODE.serverError);
    }

    try {
      await sesClient.send(
        new SendEmailCommand({
          Destination: {
            ToAddresses: [user.email],
          },
          Message: {
            Body: {
              Html: {
                Data: generateVerificationEmail(token),
              },
            },
            Subject: {
              Data: "Verify your account",
            },
          },
          Source: "no-reply@baddit.life",
        })
      );
    } catch {
      throw new HttpException(HttpStatusCode.INTERNAL_SERVER_ERROR, APP_ERROR_CODE.serverError);
    }
  }

  async verifyEmailToken(token: string) {
    const foundToken = await userRepository.getUserByToken(token);

    if (foundToken) {
      if (foundToken.expireAt.getTime() >= Date.now()) {
        await userRepository.updateEmailVerified(foundToken.userId);
        await userRepository.deleteEmailToken(token);
      } else {
        await userRepository.deleteEmailToken(token);
        throw new HttpException(HttpStatusCode.INVALID_TOKEN, APP_ERROR_CODE.tokenExpired);
      }
    }

    if (!foundToken)
      throw new HttpException(HttpStatusCode.INVALID_TOKEN, APP_ERROR_CODE.tokenInvalid);
  }
}

export default new emailService();
