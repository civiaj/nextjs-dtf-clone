import { Prisma, followUserSelect } from '@/shared/services/prisma'

export const FOLLOW_USER_ACTIONS = ['create', 'remove'] as const

export type TFollowUserSelect = Prisma.FollowUserGetPayload<{ select: typeof followUserSelect }>
export type TFollowUserMetrics = {
    followersCount: number
    subscriptionsCount: number
    isFollowed: boolean
}
