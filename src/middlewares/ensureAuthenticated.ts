import { NextFunction, Request, Response } from "express";

const ensureAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return res.status(401).json({
      error: { code: "UNAUTHORIZED", message: "You are not logged in." },
    });
  }

  if (req.user && !req.user.emailVerified) {
    return res.status(401).json({
      error: {
        code: "EMAIL_NOT_VERIFIED",
        message: "You need to verify your email address.",
      },
    });
  }

  next();
};

export default ensureAuthenticated;
