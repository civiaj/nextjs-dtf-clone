import { ApiError } from '@/lib/error'
import {
    IMuteRepository,
    TCreateMutePayload,
    TGetAllMutesPayload,
    TGetMuteMetricsPayload,
    TMuteMetrics,
    TRemoveMutePayload
} from '@/server/mute/types'
import { ERROR_MESSAGES } from '@/shared/constants'
import { muteUserSelect, prisma } from '@/shared/services/prisma'
import { TPageResult } from '@/shared/types/common.types'
import { TMuteUserMetrics, TMuteUserSelect } from '@/shared/types/mute.types'
import { TUser } from '@/shared/types/user.types'

export class MuteUserRepository implements IMuteRepository<TMuteUserSelect, TMuteMetrics<'USER'>> {
    async create({ targetId, userId }: TCreateMutePayload): Promise<TMuteUserSelect | void> {
        return await prisma.$transaction(async (tx) => {
            if (userId === targetId) {
                throw ApiError.BadRequest(ERROR_MESSAGES.USER_SUBSCRIPTION.SAME)
            }

            const exist = await tx.muteUser.findUnique({
                where: { ownerId_targetUserId: { ownerId: userId, targetUserId: targetId } },
                select: muteUserSelect
            })

            if (exist) return exist

            return await tx.muteUser.create({
                data: { ownerId: userId, targetUserId: targetId }
            })
        })
    }

    async remove({ targetId, userId }: TRemoveMutePayload): Promise<TMuteUserSelect | void> {
        console.log({ targetId, userId })
        return await prisma.muteUser.delete({
            where: { ownerId_targetUserId: { ownerId: userId, targetUserId: targetId } }
        })
    }

    async getAll({ userId, cursor }: TGetAllMutesPayload): Promise<TPageResult<TMuteUserSelect>> {
        const limit = 10
        const mutes = await prisma.muteUser.findMany({
            where: { ownerId: userId },
            orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
            take: limit + 1,
            skip: cursor ? 1 : 0,
            cursor: cursor ? { id: cursor } : undefined,
            select: muteUserSelect
        })

        const hasNextPage = mutes.length > limit
        const items = mutes.slice(0, limit)

        return {
            items,
            cursor: hasNextPage ? items[items.length - 1].id : null
        }
    }

    async getMetrics({ ids, userId }: TGetMuteMetricsPayload): Promise<TMuteMetrics<'USER'>> {
        const map = new Map<TUser['id'], TMuteUserMetrics>()

        ids.forEach((id) => {
            map.set(id, this.getDefaultMetrics())
        })

        if (!userId || !ids.length) return map

        const [mutes, mutedMe] = await Promise.all([
            prisma.muteUser.findMany({
                where: {
                    ownerId: userId, // я блокирую
                    targetUserId: { in: ids } // эти сущности
                },
                select: muteUserSelect
            }),
            prisma.muteUser.findMany({
                where: {
                    ownerId: { in: ids }, // эти сущности
                    targetUserId: userId // меня блокируют
                },
                select: muteUserSelect
            })
        ])

        const mutesSet = new Set(mutes.map((m) => m.targetUserId))
        const mutedMeSet = new Set(mutedMe.map((m) => m.ownerId))

        ids.forEach((id) => {
            map.set(id, {
                isMuted: mutesSet.has(id),
                isMutedMe: mutedMeSet.has(id)
            })
        })

        return map
    }

    getDefaultMetrics(): TMuteUserMetrics {
        return {
            isMuted: false,
            isMutedMe: false
        }
    }
}
