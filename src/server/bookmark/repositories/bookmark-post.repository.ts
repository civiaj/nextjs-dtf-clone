import { ApiError } from '@/lib/error'
import {
    IBookmarkRepository,
    TGetAllBookmarkPayload,
    TGetBookmarkMetricsPayload,
    TUpdateBookmarkPayload
} from '@/server/bookmark/types'
import { ERROR_MESSAGES } from '@/shared/constants'
import { bookmarkPostSelect, prisma } from '@/shared/services/prisma'
import { TBookmarkMetrics, TBookmarkPostSelect } from '@/shared/types/bookmark.types'
import { TPost } from '@/shared/types/post.types'

export class BookmarkPostRepository
    implements IBookmarkRepository<TBookmarkPostSelect, Map<TPost['id'], TBookmarkMetrics>>
{
    async update({ userId, targetId }: TUpdateBookmarkPayload) {
        return await prisma.$transaction(async (tx) => {
            const existing = await tx.bookmarkPost.findUnique({
                where: {
                    ownerId_targetPostId: {
                        ownerId: userId,
                        targetPostId: targetId
                    }
                },
                select: bookmarkPostSelect
            })

            if (existing) {
                return await tx.bookmarkPost.delete({
                    where: {
                        ownerId_targetPostId: {
                            ownerId: userId,
                            targetPostId: targetId
                        }
                    },
                    select: bookmarkPostSelect
                })
            }

            const post = await tx.post.findUnique({
                where: { id: targetId }
            })

            if (!post || post.status !== 'PUBLISHED') {
                throw ApiError.BadRequest(ERROR_MESSAGES.POST.NOT_FOUND)
            }

            return await tx.bookmarkPost.create({
                data: {
                    ownerId: userId,
                    targetPostId: targetId
                },
                select: bookmarkPostSelect
            })
        })
    }

    async getAll({ userId, cursor }: TGetAllBookmarkPayload) {
        const limit = 10
        const mutes = await prisma.bookmarkPost.findMany({
            where: { ownerId: userId },
            orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
            take: limit + 1,
            skip: cursor ? 1 : 0,
            cursor: cursor ? { id: cursor } : undefined,
            select: bookmarkPostSelect
        })

        const hasNextPage = mutes.length > limit
        const items = mutes.slice(0, limit)

        return {
            items,
            cursor: hasNextPage ? items[items.length - 1].id : null
        }
    }

    async getMetrics({ ids, userId }: TGetBookmarkMetricsPayload) {
        const map = new Map<TPost['id'], TBookmarkMetrics>()
        if (!ids.length) return map

        const [counts, viewer] = await Promise.all([
            prisma.bookmarkPost.groupBy({
                by: ['targetPostId'],
                _count: { targetPostId: true },
                where: { targetPostId: { in: ids } }
            }),
            userId
                ? prisma.bookmarkPost.findMany({
                      where: { ownerId: userId, targetPostId: { in: ids } },
                      select: { targetPostId: true }
                  })
                : []
        ])

        const countsMap = new Map(counts.map((m) => [m.targetPostId, m._count.targetPostId]))
        const viewerSet = new Set(viewer.map((m) => m.targetPostId))

        ids.forEach((id) => {
            map.set(id, {
                bookmarkCount: countsMap.get(id) || 0,
                isBookmarked: viewerSet.has(id)
            })
        })

        return map
    }
}
