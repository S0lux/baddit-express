import { NextFunction, Request, Response } from "express";
import { HttpException } from "../exception/httpError";
import { APP_ERROR_CODE, HttpStatusCode } from "../constants/constant";

const handleAuthError = (error: Error, req: Request, res: Response, next: NextFunction) => {
  if (error) {
    throw new HttpException(HttpStatusCode.UNAUTHORIZED, APP_ERROR_CODE.invalidCredentials);
  }
};

export default handleAuthError;
