import { Request, Response } from "express";
import { handleServiceError } from "../utils/handleServiceError";
import communityService from "../services/communityService";

const createCommunity = async (req: Request, res: Response) => {
  try {
    const data = { ...req.body, ownerId: req.user!.id };
    await communityService.createCommunity(data);
    return res.status(201).json({ message: "Community created" });
  } catch (error) {
    handleServiceError(res, error);
  }
};
const joinCommunity = async (req: Request, res: Response) => {
  try {
    const community = await communityService.getCommunity(req.params.communityName);
    const data = { userId: req.user!.id, communityId: community!.id };
    await communityService.createCommunityMember(data);
    return res.status(201).json({ message: "Joined" });
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
  joinCommunity,
};
