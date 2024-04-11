import { NextFunction, Request, Response } from "express";
import { HttpException } from "../exception/httpError";

function handleError(err: HttpException, req: Request, res: Response, next: NextFunction) {
  if (!err?.status || err.status >= 500) {
    console.error(err);
  }

  return res.status(err.status || 500).json({
    error: err.errorDetails?.code || "INTERNAL_SERVER_ERROR",
    message: err.errorDetails?.message || "Something went wrong!",
  });
}

export default handleError;
