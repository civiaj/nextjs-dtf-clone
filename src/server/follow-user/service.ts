import {
    IFollowUserRepository,
    IFollowUserService,
    TCreateFollowUserPayload,
    TGetAllFollowUserFollowersPayload,
    TGetAllFollowUserSubscriptionsPayload,
    TGetFollowUserMetricsPayload,
    TRemoveFollowUserPayload
} from './types'

export class FollowUserService implements IFollowUserService {
    constructor(private followUserRepository: IFollowUserRepository) {}
    async create(payload: TCreateFollowUserPayload) {
        return await this.followUserRepository.create(payload)
    }

    async remove(payload: TRemoveFollowUserPayload) {
        return await this.followUserRepository.remove(payload)
    }

    async getMetrics(payload: TGetFollowUserMetricsPayload) {
        return await this.followUserRepository.getMetrics(payload)
    }

    async getUserFollowers(payload: TGetAllFollowUserFollowersPayload) {
        return await this.followUserRepository.getUserFollowers(payload)
    }

    async getUserSubscriptions(payload: TGetAllFollowUserSubscriptionsPayload) {
        return await this.followUserRepository.getUserSubscriptions(payload)
    }
}
