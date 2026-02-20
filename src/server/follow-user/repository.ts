import { ApiError } from '@/lib/error'
import { ERROR_MESSAGES } from '@/shared/constants'
import { followUserSelect, prisma } from '@/shared/services/prisma'
import { TPageResult } from '@/shared/types/common.types'
import { TFollowUserMetrics, TFollowUserSelect } from '@/shared/types/follow.types'
import { TUser } from '@/shared/types/user.types'
import {
    IFollowUserRepository,
    TCreateFollowUserPayload,
    TGetAllFollowUserFollowersPayload,
    TGetAllFollowUserSubscriptionsPayload,
    TGetFollowUserMetricsPayload,
    TRemoveFollowUserPayload
} from './types'

export class FollowUserRepository implements IFollowUserRepository {
    async create({ subscriberId, targetUserId }: TCreateFollowUserPayload) {
        if (subscriberId === targetUserId) {
            throw ApiError.BadRequest(ERROR_MESSAGES.USER_SUBSCRIPTION.SAME)
        }

        await prisma.followUser.create({ data: { subscriberId, targetUserId } })
    }

    async remove({ subscriberId, targetUserId }: TRemoveFollowUserPayload) {
        if (subscriberId === targetUserId) {
            throw ApiError.BadRequest(ERROR_MESSAGES.USER_SUBSCRIPTION.SAME)
        }

        await prisma.followUser.deleteMany({
            where: { subscriberId, targetUserId }
        })
    }

    async getUserFollowers({
        cursor,
        userId
    }: TGetAllFollowUserFollowersPayload): Promise<TPageResult<TFollowUserSelect>> {
        const take = 10
        const follows = await prisma.followUser.findMany({
            where: { targetUserId: userId },
            orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
            take: take + 1,
            skip: cursor ? 1 : 0,
            cursor: cursor ? { id: cursor } : undefined,
            select: followUserSelect
        })

        const hasNextPage = follows.length > take
        const items = follows.slice(0, take)

        return {
            items,
            cursor: hasNextPage ? items[items.length - 1].id : null
        }
    }

    async getUserSubscriptions({
        cursor,
        userId
    }: TGetAllFollowUserSubscriptionsPayload): Promise<TPageResult<TFollowUserSelect>> {
        const take = 10
        const follows = await prisma.followUser.findMany({
            where: { subscriberId: userId },
            orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
            take: take + 1,
            skip: cursor ? 1 : 0,
            cursor: cursor ? { id: cursor } : undefined,
            select: followUserSelect
        })

        const hasNextPage = follows.length > take
        const items = follows.slice(0, take)

        return {
            items,
            cursor: hasNextPage ? items[items.length - 1].id : null
        }
    }

    async getMetrics({
        ids,
        userId
    }: TGetFollowUserMetricsPayload): Promise<Map<TUser['id'], TFollowUserMetrics>> {
        const map = new Map<TUser['id'], TFollowUserMetrics>()

        if (!ids.length) return map

        const [followerGroups, subscriptionGroups, viewerFollows] = await Promise.all([
            prisma.followUser.groupBy({
                by: ['targetUserId'],
                where: { targetUserId: { in: ids } },
                _count: { targetUserId: true }
            }),
            prisma.followUser.groupBy({
                by: ['subscriberId'],
                where: { subscriberId: { in: ids } },
                _count: { subscriberId: true }
            }),
            userId
                ? prisma.followUser.findMany({
                      where: { targetUserId: { in: ids }, subscriberId: userId },
                      select: { targetUserId: true }
                  })
                : []
        ])

        const followersCountByUser = new Map(
            followerGroups.map((g) => [g.targetUserId, g._count.targetUserId])
        )

        const subscriptionsCountByUser = new Map(
            subscriptionGroups.map((g) => [g.subscriberId, g._count.subscriberId])
        )

        const viewerFollowsSet = new Set(viewerFollows.map((f) => f.targetUserId))

        ids.forEach((id) => {
            map.set(id, {
                followersCount: followersCountByUser.get(id) ?? 0,
                subscriptionsCount: subscriptionsCountByUser.get(id) ?? 0,
                isFollowed: viewerFollowsSet.has(id)
            })
        })

        return map
    }
}
