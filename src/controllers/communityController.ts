import { NextFunction, Request, Response } from "express";
import communityService from "../services/communityService";
import postService from "../services/postService";

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
    const community = await communityService.getCommunityByName(req.params["communityName"]);
    const data = { userId: req.user!.id, communityId: community!.id };
    await communityService.createCommunityMember(data);
    //if no error has been thrown when creating member, go to this line
    await communityService.updateCommunityMemberCount(community.name, community.memberCount);
    return res.status(200).json({ message: "Joined" });
  } catch (error) {
    next(error);
  }
};
const getCommunity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const communityFound = await communityService.getCommunityByName(req.params["communityName"]);
    return res.status(200).json({ community: communityFound });
  } catch (error) {
    next(error);
  }
};

const deleteCommunity = async (req: Request, res: Response, next: NextFunction) => {
  const communityName = req.params["communityName"];
  const user = req.user!;
  try {
    //fist check if community deleted field is false or true , if false then return comumnity
    const community = await communityService.getCommunityByName(communityName);
    await communityService.deleteCommunityByName(community, user);
    //after change deleted field of community to false, delete all the posts in this community by change deleted field of them
    await postService.deleteAllPostsInCommunity(community.name);
    return res.status(201).json({ message: "Community has been deleted" });
  } catch (error) {
    next(error);
  }
};

export const communityController = {
  createCommunity,
  getCommunity,
  joinCommunity,
  deleteCommunity,
};
