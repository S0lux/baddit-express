import { NextFunction, Request, Response } from "express";
import { registerBodyValidator } from "../validators/authValidators";
import authService from "../services/authService";
import { handleServiceError } from "../utils/handleServiceError";
import awsService from "../services/awsService";
import { userRepository } from "../repositories/userRepository";

const loginUser = async (req: Request, res: Response) => {
  return res.status(200).json({ user: req.user });
};

const registerUser = async (req: Request, res: Response) => {
  const parsedResult = registerBodyValidator.safeParse(req.body);

  if (!parsedResult.success) {
    return res.status(400).json({
      error: { code: "BAD_REQUEST", message: "Invalid request body" },
    });
  }

  try {
    const newUser = await authService.register(parsedResult.data);
    await awsService.sendVerificationEmail(newUser.id);
    return res.status(201).json({ message: "Email sent" });
  } catch (error) {
    handleServiceError(res, error);
  }
};

const logoutUser = async (req: Request, res: Response, next: NextFunction) => {
  return req.logout((err: any) => {
    if (err) next(err);
    return res.status(200).json({ message: "Logged out" });
  });
};

const verifyEmail = async(req:Request , res:Response)=>{
  const tokenToCheck = req.body["token"]
  if(tokenToCheck)
  {
    const listTokens = await userRepository.getEmailTokens();
    for(let i = 0 ; i < listTokens.length ; i++){
      if(listTokens[i].token === tokenToCheck){
        if(listTokens[i].expireAt.getTime >= Date.now){
          userRepository.updateEmailVerified(listTokens[i].userId);
          return res.status(200).json({
            success: { message: "Email Verified !"}
          })
        }
        else{
          return res.status(498).json({
            error: {message: "Token expired !"}
          })
        }
      }
    }
  }
  return res.status(498).json({
    error: {message: "Invalid token !"}
  })
}


export const authController = {
  loginUser,
  logoutUser,
  verifyEmail,
  registerUser,
};
