import { FollowUser, User } from '@/shared/services/prisma'
import { TPageResult } from '@/shared/types/common.types'
import { TFollowUserMetrics } from '@/shared/types/follow.types'

export type TCreateFollowUserPayload = Pick<FollowUser, 'subscriberId' | 'targetUserId'>
export type TRemoveFollowUserPayload = Pick<FollowUser, 'subscriberId' | 'targetUserId'>
export type TGetAllFollowUserSubscriptionsPayload = {
    cursor?: number
    userId: FollowUser['subscriberId']
}
export type TGetAllFollowUserFollowersPayload = {
    cursor?: number
    userId: FollowUser['targetUserId']
}
export type TGetFollowUserMetricsPayload = { ids: User['id'][]; userId?: User['id'] }

export interface IFollowUserService {
    create(dto: TCreateFollowUserPayload): Promise<void>
    remove(dto: TRemoveFollowUserPayload): Promise<void>
    getUserSubscriptions(
        payload: TGetAllFollowUserSubscriptionsPayload
    ): Promise<TPageResult<FollowUser>>
    getUserFollowers(payload: TGetAllFollowUserFollowersPayload): Promise<TPageResult<FollowUser>>
    getMetrics(payload: TGetFollowUserMetricsPayload): Promise<Map<User['id'], TFollowUserMetrics>>
}

export interface IFollowUserRepository {
    create(dto: TCreateFollowUserPayload): Promise<void>
    remove(dto: TRemoveFollowUserPayload): Promise<void>
    getUserSubscriptions(
        payload: TGetAllFollowUserSubscriptionsPayload
    ): Promise<TPageResult<FollowUser>>
    getUserFollowers(payload: TGetAllFollowUserFollowersPayload): Promise<TPageResult<FollowUser>>
    getMetrics(payload: TGetFollowUserMetricsPayload): Promise<Map<User['id'], TFollowUserMetrics>>
}
