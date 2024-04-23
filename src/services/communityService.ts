import { Community, CommunityRole, User, UserRole } from "@prisma/client";
import { APP_ERROR_CODE, HttpStatusCode } from "../constants/constant";
import { HttpException } from "../exception/httpError";
import { communityRepository } from "../repositories/communityRepository";

class communityService {
  async createCommunity(communityData: { name: string; description: string; ownerId: string }) {
    const newCommunity = await communityRepository.createCommunity(communityData);
    if (!newCommunity)
      throw new HttpException(HttpStatusCode.CONFLICT, APP_ERROR_CODE.communityNameTaken);
    return newCommunity;
  }

  async createCommunityModerator(userId: string, communityId: string) {
    const newModerator = await communityRepository.createCommunityModerator(userId, communityId);
    if (!newModerator)
      throw new HttpException(HttpStatusCode.CONFLICT, APP_ERROR_CODE.userIsAlreadyModerator);
    return newModerator;
  }

  async createCommunityMember(data: { userId: string; communityId: string }) {
    const newMember = await communityRepository.createCommunityMember(data);
    if (!newMember) {
      throw new HttpException(HttpStatusCode.CONFLICT, APP_ERROR_CODE.userAlreadyInCommunity);
    }
  }

  async getCommunityByName(communityName: string) {
    const community = await communityRepository.getCommunityByName(communityName);
    if (!community)
      throw new HttpException(HttpStatusCode.NOT_FOUND, APP_ERROR_CODE.communityNotFound);
    return community;
  }

  async getUserCommunityRole(userid: string, communityId: string) {
    return await communityRepository.getUserCommunityRole(userid, communityId);
  }
  async getCommunitiesWithQueries(name: string, cursor?: string) {
    try {
      return await communityRepository.getCommunitiesWithQueries(name, cursor);
    } catch (err) {
      throw new HttpException(HttpStatusCode.INTERNAL_SERVER_ERROR, APP_ERROR_CODE.serverError);
    }
  }
  async deleteCommunityByName(community: Community, user: Express.User) {
    const userInCommunity = await this.getUserCommunityRole(user.id, community.id);
    const ownerId = community.ownerId;
    /*
    what we are doing here is checking user's permission to delete the community
    if user had no right permission , then throw exception + forbidden code
    esle continue and check server error
    */
    if (
      userInCommunity?.communityRole === CommunityRole.MODERATOR ||
      ownerId === user.id ||
      user.role === UserRole.ADMIN
    ) {
      try {
        await communityRepository.deleteCommunity(community.name);
      } catch (err) {
        throw new HttpException(HttpStatusCode.INTERNAL_SERVER_ERROR, APP_ERROR_CODE.serverError);
      }
    } else {
      throw new HttpException(HttpStatusCode.FORBIDDEN, APP_ERROR_CODE.insufficientPermissions);
    }
  }
  async updateCommunityMemberCount(communityName: string, memberCount: number) {
    try {
      await communityRepository.updateCommunityMemberCount(communityName, memberCount);
    } catch (err) {
      throw new HttpException(HttpStatusCode.INTERNAL_SERVER_ERROR, APP_ERROR_CODE.serverError);
    }
  }
  async updateCommunityLogo(community: Community, user: Express.User, logoUrl: string) {
    const userInCommunity = await this.getUserCommunityRole(user.id, community.id);
    const ownerId = community.ownerId;
    if (
      userInCommunity?.communityRole === CommunityRole.MODERATOR ||
      ownerId === user.id ||
      user.role === UserRole.ADMIN
    ) {
      try {
        await communityRepository.updateLogo(community.name, logoUrl);
      } catch (err) {
        throw new HttpException(HttpStatusCode.INTERNAL_SERVER_ERROR, APP_ERROR_CODE.serverError);
      }
    } else {
      throw new HttpException(HttpStatusCode.FORBIDDEN, APP_ERROR_CODE.insufficientPermissions);
    }
  }
  async updateCommunityBanner(community: Community, user: Express.User, bannerUrl: string) {
    const userInCommunity = await this.getUserCommunityRole(user.id, community.id);
    const ownerId = community.ownerId;
    if (
      userInCommunity?.communityRole === CommunityRole.MODERATOR ||
      ownerId === user.id ||
      user.role === UserRole.ADMIN
    ) {
      try {
        await communityRepository.updateLogo(community.name, bannerUrl);
      } catch (err) {
        throw new HttpException(HttpStatusCode.INTERNAL_SERVER_ERROR, APP_ERROR_CODE.serverError);
      }
    } else {
      throw new HttpException(HttpStatusCode.FORBIDDEN, APP_ERROR_CODE.insufficientPermissions);
    }
  }
}

export default new communityService();
