import { NextFunction, Request, Response } from "express";
import { MulterError } from "multer";

const handleMulterError = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof MulterError) {
    return res.status(400).json({
      error: {
        code: err.code,
        message: err.field || "No error message provided",
      },
    });
  }
};

export default handleMulterError;
