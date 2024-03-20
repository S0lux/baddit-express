import { NextFunction, Request, Response } from "express";
import { loginBodyValidator } from "./schemas/loginBody";
import { registerBodyValidator } from "./schemas/registerBody";
import { emailTokenValidator } from "./schemas/emailTokenBody";

const login = (req: Request, res: Response, next: NextFunction) => {
  const body = req.body;
  const result = loginBodyValidator.safeParse(body);

  if (!result.success) {
    res
      .status(400)
      .json({ error: { code: "BAD_REQUEST", message: result.error.errors[0].message } });
  }

  next();
};

const register = (req: Request, res: Response, next: NextFunction) => {
  const body = req.body;
  const result = registerBodyValidator.safeParse(body);

  if (!result.success) {
    res
      .status(400)
      .json({ error: { code: "BAD_REQUEST", message: result.error.errors[0].message } });
  }

  next();
};

const emailToken = (req: Request, res: Response, next: NextFunction) => {
  const body = req.body;
  const result = emailTokenValidator.safeParse(body);

  if (!result.success) {
    res
      .status(400)
      .json({ error: { code: "BAD_REQUEST", message: result.error.errors[0].message } });
  }

  next();
};

export const authValidator = {
  login,
  register,
  emailToken,
};
