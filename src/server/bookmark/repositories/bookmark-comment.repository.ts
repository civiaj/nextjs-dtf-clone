import {
    IBookmarkRepository,
    TGetAllBookmarkPayload,
    TGetBookmarkMetricsPayload,
    TUpdateBookmarkPayload
} from '@/server/bookmark/types'
import { bookmarkCommentSelect, prisma } from '@/shared/services/prisma'
import { TBookmarkCommentSelect, TBookmarkMetrics } from '@/shared/types/bookmark.types'
import { TComment } from '@/shared/types/comment.types'

export class BookmarkCommentRepository
    implements IBookmarkRepository<TBookmarkCommentSelect, Map<TComment['id'], TBookmarkMetrics>>
{
    async update({ userId, targetId }: TUpdateBookmarkPayload) {
        return await prisma.$transaction(async (tx) => {
            const existing = await tx.bookmarkComment.findUnique({
                where: {
                    ownerId_targetCommentId: {
                        ownerId: userId,
                        targetCommentId: targetId
                    }
                },
                select: bookmarkCommentSelect
            })

            if (existing) {
                return await tx.bookmarkComment.delete({
                    where: {
                        ownerId_targetCommentId: {
                            ownerId: userId,
                            targetCommentId: targetId
                        }
                    },
                    select: bookmarkCommentSelect
                })
            }

            return await tx.bookmarkComment.create({
                data: {
                    ownerId: userId,
                    targetCommentId: targetId
                },
                select: bookmarkCommentSelect
            })
        })
    }

    async getAll({ userId, cursor }: TGetAllBookmarkPayload) {
        const limit = 10
        const mutes = await prisma.bookmarkComment.findMany({
            where: { ownerId: userId },
            orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
            take: limit + 1,
            skip: cursor ? 1 : 0,
            cursor: cursor ? { id: cursor } : undefined,
            select: bookmarkCommentSelect
        })

        const hasNextPage = mutes.length > limit
        const items = mutes.slice(0, limit)

        return {
            items,
            cursor: hasNextPage ? items[items.length - 1].id : null
        }
    }

    async getMetrics({ ids, userId }: TGetBookmarkMetricsPayload) {
        const map = new Map<TComment['id'], TBookmarkMetrics>()
        if (!ids.length) return map

        const [counts, viewer] = await Promise.all([
            prisma.bookmarkComment.groupBy({
                by: ['targetCommentId'],
                _count: { targetCommentId: true },
                where: { targetCommentId: { in: ids } }
            }),
            userId
                ? prisma.bookmarkComment.findMany({
                      where: { ownerId: userId, targetCommentId: { in: ids } },
                      select: { targetCommentId: true }
                  })
                : []
        ])

        const countsMap = new Map(counts.map((m) => [m.targetCommentId, m._count.targetCommentId]))
        const viewerSet = new Set(viewer.map((m) => m.targetCommentId))

        ids.forEach((id) => {
            map.set(id, {
                bookmarkCount: countsMap.get(id) ?? 0,
                isBookmarked: viewerSet.has(id) ?? false
            })
        })

        return map
    }
}
