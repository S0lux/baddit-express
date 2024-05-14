import { NextFunction, Request, Response } from "express";
import { commentBodyValidator } from "./schemas/commentBody";
import { HttpException } from "../exception/httpError";
import { APP_ERROR_CODE, HttpStatusCode } from "../constants/constant";
import { voteCommentBodyValidator } from "./schemas/voteCommentBody";

const create = (req: Request, res: Response, next: NextFunction) => {
  const body = req.body;
  const result = commentBodyValidator.safeParse(body);

  if (!result.success) {
    throw new HttpException(HttpStatusCode.BAD_REQUEST, APP_ERROR_CODE.unexpectedBody);
  }

  next();
};

const vote = (req: Request, res: Response, next: NextFunction) => {
  const data = {
    commentId: req.body["commentId"],
    state: req.body.state,
  };

  const result = voteCommentBodyValidator.safeParse(data);

  if (!result.success) {
    console.log(result.error);
    throw new HttpException(HttpStatusCode.BAD_REQUEST, APP_ERROR_CODE.unexpectedBody);
  }

  next();
};
export const commentValidator = {
  create,
  vote,
};
