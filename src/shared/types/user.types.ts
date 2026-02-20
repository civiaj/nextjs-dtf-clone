import { Prisma, userSelect, FollowUser } from '@/shared/services/prisma'
import { TFollowUserMetrics } from '@/shared/types/follow.types'
import { TMuteUserMetrics } from '@/shared/types/mute.types'

export type TUserSelect = Prisma.UserGetPayload<{ select: typeof userSelect }>
export type TUserMetrics = TFollowUserMetrics & TMuteUserMetrics
export type TUser = TUserSelect & TUserMetrics
export type TFollowUser = { followData: Pick<FollowUser, 'createdAt'> } & { user: TUser }

export const FOLLOWABLE_CONTENT = ['followers', 'follows'] as const
export type TFollowableContent = (typeof FOLLOWABLE_CONTENT)[number]
