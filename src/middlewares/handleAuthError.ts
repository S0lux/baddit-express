import { NextFunction, Request, Response } from "express";

const handleAuthError = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error)
    return res.status(401).json({
      error: {
        code: "INVALID_CREDENTIALS",
        message: "Username or password is incorrect",
      },
    });
};

export default handleAuthError;
