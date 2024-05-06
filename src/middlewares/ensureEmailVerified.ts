import { NextFunction, Request, Response } from "express";
import { HttpException } from "../exception/httpError";
import { APP_ERROR_CODE, HttpStatusCode } from "../constants/constant";

const ensureEmailVerified = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user?.id) {
    throw new HttpException(HttpStatusCode.UNAUTHORIZED, APP_ERROR_CODE.notLoggedIn);
  }

  if (req.user && !req.user.emailVerified) {
    throw new HttpException(HttpStatusCode.UNAUTHORIZED, APP_ERROR_CODE.emailNotVerified);
  }

  next();
};

export default ensureEmailVerified;
