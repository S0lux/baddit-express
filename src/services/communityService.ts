import { communityRepository } from "../repositories/communityRepository";

class communityService {
  async createCommunity(communityData: { name: string; description: string; ownerId: string }) {
    const newCommunity = await communityRepository.createCommunity(communityData);
    if (!newCommunity)
      throw {
        status: 409,
        code: "CONFLICT",
        message: "Community name is already taken.",
      };
    return newCommunity;
  }
  async createCommunityModerator(userId: string, communityId: string) {
    const newModerator = await communityRepository.createCommunityModerator(userId, communityId);
    if (!newModerator)
      throw {
        status: 409,
        code: "CONFLICT",
        message: "User is already moderator of this community.",
      };
    return newModerator;
  }
  async createCommunityMember(data: { userId: string; communityId: string }) {
    const newMember = await communityRepository.createCommunityMember(data);
    if (!newMember) {
      throw {
        status: 409,
        code: "CONFLICT",
        message: "User is already join this community.",
      };
    }
  }
  async getCommunity(communityName: string) {
    const community = await communityRepository.getCommunityByName(communityName);
    if (!community)
      throw {
        status: 404,
        code: "NOT_FOUND",
        message: "There is no community name: " + communityName,
      };
    return community;
  }
}

export default new communityService();
