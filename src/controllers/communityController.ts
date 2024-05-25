import { NextFunction, Request, Response } from "express";
import communityService from "../services/communityService";
import postService from "../services/postService";
import { HttpException } from "../exception/httpError";
import { APP_ERROR_CODE, HttpStatusCode } from "../constants/constant";
import { CommunityRole } from "@prisma/client";

const createCommunity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = { ...req.body, ownerId: req.user!.id };
    const community = await communityService.createCommunity(data);
    const admin = await communityService.createCommunityAdmin(req.user!.id, community.id);
    await communityService.updateCommunityMemberCount(community.name, community.memberCount + 1);
    console.log(admin);
    return res.status(201).json({ message: "Community created" });
  } catch (error) {
    next(error);
  }
};

const createModerator = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const communityName = req.params.communityName as string;
    const memberName = req.body.memberName as string;
    if (!communityName || !memberName) {
      throw new HttpException(HttpStatusCode.BAD_REQUEST, APP_ERROR_CODE.unexpectedBody);
    }
    const communityMatched = await communityService.getCommunityByName(communityName);

    if (communityMatched.ownerId !== req.user!.id) {
      throw new HttpException(HttpStatusCode.FORBIDDEN, APP_ERROR_CODE.insufficientPermissions);
    }
    const memberFound = await communityService.getUserInCommunity(memberName, communityMatched.id);

    if (memberFound!.communityRole !== CommunityRole.MEMBER) {
      throw new HttpException(HttpStatusCode.FORBIDDEN, APP_ERROR_CODE.onlyAcceptedForMember);
    }
    //if no community found -> throw 404 in service
    communityService.createCommunityModerator(memberName, communityMatched.id);
  } catch (err) {
    next(err);
  }
};

const joinCommunity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const community = await communityService.getCommunityByName(req.params["communityName"]);
    const data = { userId: req.user!.id, communityId: community!.id };
    const userMatched = await communityService.getUserInCommunity(data.userId, data.communityId);
    if (userMatched) {
      await communityService.joinCommunity(data.userId, data.communityId);
    } else {
      await communityService.createCommunityMember(data);
    }
    //if no error has been thrown when creating member, go to this line
    await communityService.updateCommunityMemberCount(community.name, community.memberCount + 1); // this is update for joining , so just plus one, if unjoin just substract one
    return res.status(201).json({ message: "Joined" });
  } catch (error) {
    next(error);
  }
};

const unJoinCommunity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const community = await communityService.getCommunityByName(req.params["communityName"]);
    const userId = req.user!.id;
    await communityService.unJoinCommunity(userId, community.id);
    await communityService.updateCommunityMemberCount(community.name, community.memberCount - 1);
    return res.status(201).json({ message: "Unjoined Community Successfully" });
  } catch (err) {
    next(err);
  }
};

const getCommunity = async (req: Request, res: Response, next: NextFunction) => {
  var joinStatus = "You need to be logged in";
  const userId = req.user?.id;
  try {
    const communityFound = await communityService.getCommunityByName(req.params["communityName"]);
    if (userId) {
      const userFound = await communityService.getUserInCommunity(userId, communityFound.id);
      if (userFound) {
        if (userFound.joined) joinStatus = "Joined";
        else joinStatus = "Not Joined";
      } else joinStatus = "Not Joined";
    }
    return res.status(200).json({ community: communityFound, joinStatus: joinStatus });
  } catch (error) {
    next(error);
  }
};

const getCommunitiesWithQueries = async (req: Request, res: Response, next: NextFunction) => {
  const cursor = req.query.cursor as string | undefined;
  const name = req.query.name as string | undefined;
  const userId = req.query.userId as string | undefined;
  try {
    const queries = { name, userId, cursor };
    if (userId) {
      if (userId !== req.user!.id)
        throw new HttpException(HttpStatusCode.INTERNAL_SERVER_ERROR, APP_ERROR_CODE.serverError);
    }
    const communities = await communityService.getCommunitiesWithQueries(queries);
    return res.status(200).json(communities);
  } catch (err) {
    next(err);
  }
};

const deleteCommunity = async (req: Request, res: Response, next: NextFunction) => {
  const communityName = req.params["communityName"];
  const user = req.user!;
  try {
    //First check if community deleted field is false or true , if false then return comumnity
    const community = await communityService.getCommunityByName(communityName);
    await communityService.deleteCommunityByName(community, user);
    //after change deleted field of community to false, delete all the posts in this community by change deleted field of them
    await postService.deleteAllPostsInCommunity(community.name);
    return res.status(201).json({ message: "Community has been deleted" });
  } catch (error) {
    next(error);
  }
};

const updateCommunityLogo = async (req: Request, res: Response, next: NextFunction) => {
  const communityName = req.params["communityName"];
  const user = req.user!;
  try {
    if (!req.file) {
      throw new HttpException(HttpStatusCode.BAD_REQUEST, APP_ERROR_CODE.missingMedia);
    }
    const community = await communityService.getCommunityByName(communityName);
    await communityService.updateCommunityLogo(community, user, req.file.path);
    res.status(200).json({ message: "Logo updated successfully" });
  } catch (err) {
    next(err);
  }
};
const updateCommunityBanner = async (req: Request, res: Response, next: NextFunction) => {
  const communityName = req.params["communityName"];
  const user = req.user!;
  try {
    if (!req.file) {
      throw new HttpException(HttpStatusCode.BAD_REQUEST, APP_ERROR_CODE.missingMedia);
    }
    const community = await communityService.getCommunityByName(communityName);
    await communityService.updateCommunityBanner(community, user, req.file.path);
    res.status(200).json({ message: "Banner updated successfully" });
  } catch (err) {
    next(err);
  }
};

export const communityController = {
  createCommunity,
  createModerator,
  getCommunity,
  getCommunitiesWithQueries,
  joinCommunity,
  deleteCommunity,
  updateCommunityBanner,
  updateCommunityLogo,
  unJoinCommunity,
};
