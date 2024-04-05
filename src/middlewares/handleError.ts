import { NextFunction, Request, Response } from "express";
import { HttpException } from "../exception/httpError";

function handleError(err: HttpException, req: Request, res: Response, next: NextFunction) {
  return res.status(err.status).json({
    error: err.errorDetails.code,
    message: err.errorDetails.message,
  });
}

export default handleError;
