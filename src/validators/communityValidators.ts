import { NextFunction, Request, Response } from "express";
import { communityBodyValidator } from "./schemas/communityBody";

const create = (req: Request, res: Response, next: NextFunction) => {
  const body = req.body;
  const result = communityBodyValidator.safeParse(body);
  if (!result.success) {
    res
      .status(400)
      .json({ error: { code: "BAD_REQUEST", message: result.error.errors[0].message } });
  }

  next();
};
export const communityValidators = {
  create,
};
