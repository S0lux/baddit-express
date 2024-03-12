import { NextFunction, Request, Response } from "express";

const ensureAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user) next();

  return res.status(401).json({
    error: { code: "UNAUTHORIZED", message: "You are not logged in" },
  });
};

export default ensureAuthenticated;
