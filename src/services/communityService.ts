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
}

export default new communityService();
