import { NextFunction, Request, Response } from "express";
import { loginBodyValidator } from "./schemas/loginBody";
import { registerBodyValidator } from "./schemas/registerBody";
import { emailTokenValidator } from "./schemas/emailTokenBody";
import { HttpException } from "../exception/httpError";
import { APP_ERROR_CODE, HttpStatusCode } from "../constants/constant";
import { passwordChangeValidator } from "./schemas/passwordChangeBody";

const login = (req: Request, res: Response, next: NextFunction) => {
  const body = req.body;
  const result = loginBodyValidator.safeParse(body);

  if (!result.success) {
    throw new HttpException(HttpStatusCode.BAD_REQUEST, APP_ERROR_CODE.unexpectedBody);
  }

  next();
};

const register = (req: Request, res: Response, next: NextFunction) => {
  const body = req.body;
  const result = registerBodyValidator.safeParse(body);

  if (!result.success) {
    throw new HttpException(HttpStatusCode.BAD_REQUEST, APP_ERROR_CODE.unexpectedBody);
  }

  next();
};

const emailToken = (req: Request, res: Response, next: NextFunction) => {
  const body = req.body;
  const result = emailTokenValidator.safeParse(body);

  if (!result.success) {
    throw new HttpException(HttpStatusCode.BAD_REQUEST, APP_ERROR_CODE.unexpectedBody);
  }

  next();
};

const passwordChange = (req: Request, res: Response, next: NextFunction) => {
  const body = req.body;
  const result = passwordChangeValidator.safeParse(body);

  if (!result.success) {
    throw new HttpException(HttpStatusCode.BAD_REQUEST, APP_ERROR_CODE.unexpectedBody);
  }

  next();
};

export const authValidator = {
  login,
  register,
  emailToken,
  passwordChange,
};
