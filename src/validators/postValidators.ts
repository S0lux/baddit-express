import { NextFunction, Request, Response } from "express";
import { postBodyValidator } from "./schemas/postBody";
import { HttpException } from "../exception/httpError";
import { APP_ERROR_CODE, HttpStatusCode } from "../constants/constant";

const create = (req: Request, res: Response, next: NextFunction) => {
  const body = req.body;
  const result = postBodyValidator.safeParse(body);

  if (!result.success) {
    throw new HttpException(HttpStatusCode.BAD_REQUEST, APP_ERROR_CODE.unexpectedBody);
  }

  next();
};
export const postValidators = {
  create,
};
