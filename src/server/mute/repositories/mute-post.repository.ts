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
import { mutePostSelect, prisma } from '@/shared/services/prisma'
import { TPageResult } from '@/shared/types/common.types'
import { TMutePostMetrics, TMutePostSelect } from '@/shared/types/mute.types'
import { TPost } from '@/shared/types/post.types'

export class MutePostRepository implements IMuteRepository<TMutePostSelect, TMuteMetrics<'POST'>> {
    async create({ targetId, userId }: TCreateMutePayload): Promise<TMutePostSelect | void> {
        return await prisma.$transaction(async (tx) => {
            if (userId === targetId) {
                throw ApiError.BadRequest(ERROR_MESSAGES.USER_SUBSCRIPTION.SAME)
            }

            const exist = await tx.mutePost.findUnique({
                where: {
                    ownerId_targetPostId: {
                        ownerId: userId,
                        targetPostId: targetId
                    }
                },
                select: mutePostSelect
            })

            if (exist) return exist

            const post = await tx.post.findUnique({
                where: { id: targetId }
            })

            if (!post || post.status !== 'PUBLISHED') {
                throw ApiError.BadRequest(ERROR_MESSAGES.POST.NOT_FOUND)
            }

            return await tx.mutePost.create({
                data: {
                    ownerId: userId,
                    targetPostId: targetId
                },
                select: mutePostSelect
            })
        })
    }

    async remove({ targetId, userId }: TRemoveMutePayload): Promise<TMutePostSelect | void> {
        return await prisma.mutePost.delete({
            where: { ownerId_targetPostId: { ownerId: userId, targetPostId: targetId } }
        })
    }

    async getAll({ userId, cursor }: TGetAllMutesPayload): Promise<TPageResult<TMutePostSelect>> {
        const limit = 10
        const mutes = await prisma.mutePost.findMany({
            where: { ownerId: userId },
            orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
            take: limit + 1,
            skip: cursor ? 1 : 0,
            cursor: cursor ? { id: cursor } : undefined,
            select: mutePostSelect
        })

        const hasNextPage = mutes.length > limit
        const items = mutes.slice(0, limit)

        return {
            items,
            cursor: hasNextPage ? items[items.length - 1].id : null
        }
    }

    async getMetrics({ ids, userId }: TGetMuteMetricsPayload): Promise<TMuteMetrics<'POST'>> {
        const map = new Map<TPost['id'], TMutePostMetrics>()

        ids.forEach((id) => {
            map.set(id, this.getDefaultMetrics())
        })

        if (!userId || !ids.length) return map

        const [mutes] = await Promise.all([
            prisma.mutePost.findMany({
                where: {
                    ownerId: userId,
                    targetPostId: { in: ids }
                },
                select: mutePostSelect
            })
        ])

        const mutesSet = new Set(mutes.map((m) => m.targetPostId))

        ids.forEach((id) => {
            map.set(id, { isMuted: mutesSet.has(id) })
        })

        return map
    }

    getDefaultMetrics(): TMutePostMetrics {
        return {
            isMuted: false
        }
    }
}
