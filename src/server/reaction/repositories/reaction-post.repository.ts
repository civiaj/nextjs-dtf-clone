import { ApiError } from '@/lib/error'
import {
    IReactionRepository,
    TGetAllReactionPayload,
    TGetReactionMetricsPayload,
    TUpdateReactionPayload
} from '@/server/reaction/types'
import { ERROR_MESSAGES } from '@/shared/constants'
import { prisma, reactionPostSelect, reactionValueSelect } from '@/shared/services/prisma'
import { TPost } from '@/shared/types/post.types'
import { TReactionMetrics, TReactionPostSelect } from '@/shared/types/reaction.types'

export class ReactionPostRepository
    implements IReactionRepository<TReactionPostSelect, Map<TPost['id'], TReactionMetrics>>
{
    async update({ userId, targetId, reactionValueId }: TUpdateReactionPayload) {
        return await prisma.$transaction(async (tx) => {
            const [existingReaction, reactionValue] = await Promise.all([
                tx.reactionPost.findUnique({
                    where: {
                        ownerId_targetPostId: {
                            ownerId: userId,
                            targetPostId: targetId
                        }
                    },
                    select: { reactionValueId: true }
                }),
                tx.reactionValue.findUnique({
                    where: { id: reactionValueId }
                })
            ])

            if (!reactionValue) {
                throw ApiError.BadRequest(ERROR_MESSAGES.REACTION.VALUE_NOT_FOUND)
            }

            if (existingReaction?.reactionValueId === reactionValueId) {
                return await tx.reactionPost.delete({
                    where: {
                        ownerId_targetPostId: {
                            ownerId: userId,
                            targetPostId: targetId
                        }
                    },
                    select: reactionPostSelect
                })
            }

            if (existingReaction) {
                return await tx.reactionPost.update({
                    where: {
                        ownerId_targetPostId: {
                            ownerId: userId,
                            targetPostId: targetId
                        }
                    },
                    data: { reactionValueId },
                    select: reactionPostSelect
                })
            }

            return await tx.reactionPost.create({
                data: {
                    ownerId: userId,
                    targetPostId: targetId,
                    reactionValueId
                },
                select: reactionPostSelect
            })
        })
    }

    async getAll({ userId, cursor }: TGetAllReactionPayload) {
        const limit = 10
        const reactions = await prisma.reactionPost.findMany({
            where: { ownerId: userId },
            orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
            cursor: cursor ? { id: cursor } : undefined,
            skip: cursor ? 1 : 0,
            take: limit + 1,
            select: reactionPostSelect
        })

        const hasNextPage = reactions.length > limit
        const items = reactions.slice(0, limit)

        return {
            items,
            cursor: hasNextPage ? items[items.length - 1].id : null
        }
    }

    async getMetrics({ ids, userId }: TGetReactionMetricsPayload) {
        const [allReactions, counts, userReactions] = await Promise.all([
            prisma.reactionValue.findMany({ select: reactionValueSelect, orderBy: { id: 'asc' } }),
            prisma.reactionPost.groupBy({
                by: ['targetPostId', 'reactionValueId'],
                where: { targetPostId: { in: ids } },
                _count: { reactionValueId: true }
            }),
            userId
                ? prisma.reactionPost.findMany({
                      where: {
                          targetPostId: { in: ids },
                          ownerId: userId
                      },
                      select: { targetPostId: true, reactionValueId: true }
                  })
                : []
        ])

        const countMap = new Map(
            counts.map((c) => [`${c.targetPostId}_${c.reactionValueId}`, c._count.reactionValueId])
        )
        const userMap = new Map(userReactions.map((r) => [r.targetPostId, r.reactionValueId]))
        const reactionsMap = new Map<TPost['id'], TReactionMetrics>()

        ids.forEach((id) => {
            reactionsMap.set(id, {
                reactions: {
                    items: allReactions.map((r) => ({
                        id: r.id,
                        emoji: r.emoji,
                        name: r.name,
                        count: countMap.get(`${id}_${r.id}`) ?? 0
                    })),
                    activeReactionId: userMap.get(id) ?? null
                }
            })
        })

        return reactionsMap
    }
}
