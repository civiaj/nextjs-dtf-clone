import { ApiError } from '@/lib/error'
import {
    IReactionRepository,
    TGetAllReactionPayload,
    TUpdateReactionPayload
} from '@/server/reaction/types'
import { ERROR_MESSAGES } from '@/shared/constants'
import { prisma, reactionCommentSelect, reactionValueSelect } from '@/shared/services/prisma'
import { TComment } from '@/shared/types/comment.types'
import { TReactionCommentSelect, TReactionMetrics } from '@/shared/types/reaction.types'

export class ReactionCommentRepository
    implements IReactionRepository<TReactionCommentSelect, Map<TComment['id'], TReactionMetrics>>
{
    async update({ userId, targetId, reactionValueId }: TUpdateReactionPayload) {
        return await prisma.$transaction(async (tx) => {
            const [existingReaction, reactionValue] = await Promise.all([
                tx.reactionComment.findUnique({
                    where: {
                        ownerId_targetCommentId: {
                            ownerId: userId,
                            targetCommentId: targetId
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
                return await tx.reactionComment.delete({
                    where: {
                        ownerId_targetCommentId: {
                            ownerId: userId,
                            targetCommentId: targetId
                        }
                    },
                    select: reactionCommentSelect
                })
            }

            if (existingReaction) {
                return await tx.reactionComment.update({
                    where: {
                        ownerId_targetCommentId: {
                            ownerId: userId,
                            targetCommentId: targetId
                        }
                    },
                    data: { reactionValueId },
                    select: reactionCommentSelect
                })
            }

            return await tx.reactionComment.create({
                data: {
                    ownerId: userId,
                    targetCommentId: targetId,
                    reactionValueId
                },
                select: reactionCommentSelect
            })
        })
    }

    async getAll({ userId, cursor }: TGetAllReactionPayload) {
        const limit = 10
        const reactions = await prisma.reactionComment.findMany({
            where: { ownerId: userId },
            orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
            cursor: cursor ? { id: cursor } : undefined,
            skip: cursor ? 1 : 0,
            take: limit + 1,
            select: reactionCommentSelect
        })

        const hasNextPage = reactions.length > limit
        const items = reactions.slice(0, limit)

        return {
            items,
            cursor: hasNextPage ? items[items.length - 1].id : null
        }
    }

    async getMetrics({ ids, userId }: { ids: number[]; userId?: number }) {
        const map = new Map<TComment['id'], TReactionMetrics>()
        if (!ids.length) return map

        const [allReactions, counts, userReactions] = await Promise.all([
            prisma.reactionValue.findMany({ select: reactionValueSelect }),
            prisma.reactionComment.groupBy({
                by: ['targetCommentId', 'reactionValueId'],
                where: { targetCommentId: { in: ids } },
                _count: { reactionValueId: true }
            }),
            userId
                ? prisma.reactionComment.findMany({
                      where: {
                          targetCommentId: { in: ids },
                          ownerId: userId
                      },
                      select: { targetCommentId: true, reactionValueId: true }
                  })
                : []
        ])

        const countMap = new Map(
            counts.map((c) => [
                `${c.targetCommentId}_${c.reactionValueId}`,
                c._count.reactionValueId
            ])
        )
        const userMap = new Map(userReactions.map((r) => [r.targetCommentId, r.reactionValueId]))
        const reactionsMap = new Map<TComment['id'], TReactionMetrics>()

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
