import { Request, Response } from "express";
import { handleServiceError } from "../utils/handleServiceError";
import communityService from "../services/communityService";

const createCommunity = async (req: Request, res: Response) => {
  try {
    const newCommunity = await communityService.createCommunity(req.body);
    await communityService.createCommunityModerator(req.user!.id, newCommunity.id);
    return res.status(201).json({ message: "Community created" });
  } catch (error) {
    handleServiceError(res, error);
  }
};
const getCommunity = async (req: Request, res: Response) => {
  try {
    const communityFound = await communityService.getCommunity(req.params.communityName);
    return res.status(200).json({ community: communityFound });
  } catch (error) {
    handleServiceError(res, error);
  }
};
export const communityController = {
  createCommunity,
  getCommunity,
};
