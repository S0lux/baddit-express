import { NextFunction, Request, Response } from "express";
import communityService from "../services/communityService";

const createCommunity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = { ...req.body, ownerId: req.user!.id };
    await communityService.createCommunity(data);
    return res.status(201).json({ message: "Community created" });
  } catch (error) {
    next(error);
  }
};
const joinCommunity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const community = await communityService.getCommunity(req.params.communityName);
    const data = { userId: req.user!.id, communityId: community!.id };
    await communityService.createCommunityMember(data);
    return res.status(201).json({ message: "Joined" });
  } catch (error) {
    next(error);
  }
};
const getCommunity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const communityFound = await communityService.getCommunity(req.params.communityName);
    return res.status(200).json({ community: communityFound });
  } catch (error) {
    next(error);
  }
};
export const communityController = {
  createCommunity,
  getCommunity,
  joinCommunity,
};
