import { Response } from "express";

export const handleServiceError = (res: Response, error: any) => {
  if (!error.status) {
    console.error(error);
    return res
      .status(500)
      .json({
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "An unknown error occured.",
        },
      });
  } else {
    return res
      .status(error.status)
      .json({ error: { code: error.code, message: error.message } });
  }
};
