import { Comment, Post, prisma } from '@/shared/services/prisma'
import {
    DAY_WINDOW_HOURS,
    HOTNESS_REFRESH_BATCH_SIZE,
    HOTNESS_REFRESH_FRESH_INTERVAL_MINUTES,
    HOTNESS_REFRESH_RECENT_INTERVAL_MINUTES,
    HOTNESS_REFRESH_STALE_INTERVAL_MINUTES,
    HOTNESS_TIME_DELAY_HOURS,
    HOUR_IN_MS,
    MONTH_WINDOW_HOURS,
    WEEK_WINDOW_HOURS
} from './constants'
import {
    addMinutes,
    calculateCommentHotScore,
    calculateHotnessScore,
    calculatePostHotScore,
    subtractHours
} from './formula'
import { IRankingService, THotnessRefreshResult, TRankingTarget } from './types'

type TPostRankingRow = {
    id: number
    hotScore: number
    publishedAt: Date | null
    createdAt: Date
}

export class RankingService implements IRankingService {
    private getErrorMessage(error: unknown) {
        return error instanceof Error ? error.message : String(error)
    }

    private logBestEffortFailure(
        operation: string,
        context: Record<string, unknown>,
        error: unknown
    ) {
        console.error(
            `[ranking] ${operation} failed (${Object.entries(context)
                .map(([key, value]) => `${key}=${value}`)
                .join(', ')}): ${this.getErrorMessage(error)}`
        )
    }

    private getPostRankedAt(post: Pick<TPostRankingRow, 'publishedAt' | 'createdAt'>) {
        return post.publishedAt ?? post.createdAt
    }

    private calculateNextHotnessRefreshAt({
        hotScore,
        rankedAt,
        now
    }: {
        hotScore: number
        rankedAt: Date
        now: Date
    }) {
        if (hotScore <= 0) return null

        const ageHours = Math.max(0, (now.getTime() - rankedAt.getTime()) / HOUR_IN_MS)

        if (ageHours >= MONTH_WINDOW_HOURS) return null
        if (ageHours < DAY_WINDOW_HOURS) {
            return addMinutes(now, HOTNESS_REFRESH_FRESH_INTERVAL_MINUTES)
        }
        if (ageHours < WEEK_WINDOW_HOURS) {
            return addMinutes(now, HOTNESS_REFRESH_RECENT_INTERVAL_MINUTES)
        }

        return addMinutes(now, HOTNESS_REFRESH_STALE_INTERVAL_MINUTES)
    }

    private buildHotnessRefreshData({
        hotScore,
        rankedAt,
        now
    }: {
        hotScore: number
        rankedAt: Date
        now: Date
    }) {
        return {
            hotnessScore: calculateHotnessScore({
                hotScore,
                createdAt: rankedAt,
                now
            }),
            nextHotnessRefreshAt: this.calculateNextHotnessRefreshAt({
                hotScore,
                rankedAt,
                now
            })
        }
    }

    async recalculateByTarget(target: TRankingTarget, targetId: number) {
        switch (target) {
            case 'COMMENT': {
                await this.recalculateComment(targetId)
                return
            }
            case 'POST': {
                await this.recalculatePost(targetId)
                return
            }
            default: {
                throw Error(`Unknown target: ${target satisfies never}`)
            }
        }
    }

    async refreshHotnessScores(): Promise<THotnessRefreshResult> {
        const now = new Date()
        const delayedUntil = subtractHours(now, HOTNESS_TIME_DELAY_HOURS)

        const [posts, comments] = await Promise.all([
            prisma.post.findMany({
                where: {
                    status: 'PUBLISHED',
                    publishedAt: { not: null, lte: delayedUntil },
                    nextHotnessRefreshAt: { lte: now }
                },
                orderBy: [{ nextHotnessRefreshAt: 'asc' }, { id: 'asc' }],
                take: HOTNESS_REFRESH_BATCH_SIZE,
                select: { id: true, hotScore: true, publishedAt: true, createdAt: true }
            }),
            prisma.comment.findMany({
                where: {
                    isDeleted: false,
                    createdAt: { lte: delayedUntil },
                    nextHotnessRefreshAt: { lte: now }
                },
                orderBy: [{ nextHotnessRefreshAt: 'asc' }, { id: 'asc' }],
                take: HOTNESS_REFRESH_BATCH_SIZE,
                select: { id: true, hotScore: true, createdAt: true }
            })
        ])

        if (!posts.length && !comments.length) return { postCount: 0, commentCount: 0 }

        await prisma.$transaction([
            ...posts.map((post) => {
                const rankedAt = this.getPostRankedAt(post)
                return prisma.post.update({
                    where: { id: post.id },
                    data: this.buildHotnessRefreshData({
                        hotScore: post.hotScore,
                        rankedAt,
                        now
                    })
                })
            }),
            ...comments.map((comment) =>
                prisma.comment.update({
                    where: { id: comment.id },
                    data: this.buildHotnessRefreshData({
                        hotScore: comment.hotScore,
                        rankedAt: comment.createdAt,
                        now
                    })
                })
            )
        ])

        return {
            postCount: posts.length,
            commentCount: comments.length
        }
    }

    async recalculatePost(postId: Post['id']) {
        try {
            await this.recalculatePosts([postId])
        } catch (error) {
            this.logBestEffortFailure('recalculatePost', { postId }, error)
        }
    }

    async recalculateComment(commentId: Comment['id']) {
        try {
            await this.recalculateComments([commentId])
        } catch (error) {
            this.logBestEffortFailure('recalculateComment', { commentId }, error)
        }
    }

    async recalculateParentCommentByReply(commentId: Comment['id']) {
        try {
            const comment = await prisma.comment.findUnique({
                where: { id: commentId },
                select: { parentId: true }
            })

            if (!comment?.parentId) return
            await this.recalculateComments([comment.parentId])
        } catch (error) {
            this.logBestEffortFailure('recalculateParentCommentByReply', { commentId }, error)
        }
    }

    private async recalculatePosts(postIds: Post['id'][]) {
        const uniquePostIds = [...new Set(postIds)].filter((id) => Number.isInteger(id) && id > 0)
        if (!uniquePostIds.length) return

        const [posts, reactionCounts, bookmarkCounts, commentCounts] = await Promise.all([
            prisma.post.findMany({
                where: { id: { in: uniquePostIds } },
                select: { id: true, createdAt: true, publishedAt: true }
            }),
            prisma.reactionPost.groupBy({
                by: ['targetPostId'],
                where: { targetPostId: { in: uniquePostIds } },
                _count: { targetPostId: true }
            }),
            prisma.bookmarkPost.groupBy({
                by: ['targetPostId'],
                where: { targetPostId: { in: uniquePostIds } },
                _count: { targetPostId: true }
            }),
            prisma.comment.groupBy({
                by: ['postId'],
                where: { postId: { in: uniquePostIds }, isDeleted: false },
                _count: { postId: true }
            })
        ])

        if (!posts.length) return

        const reactionCountMap = new Map(
            reactionCounts.map((item) => [item.targetPostId, item._count.targetPostId])
        )
        const bookmarkCountMap = new Map(
            bookmarkCounts.map((item) => [item.targetPostId, item._count.targetPostId])
        )
        const commentCountMap = new Map(
            commentCounts.map((item) => [item.postId, item._count.postId])
        )
        const now = new Date()

        await prisma.$transaction(
            posts.map((post) => {
                const hotScore = calculatePostHotScore({
                    reactionCount: reactionCountMap.get(post.id) ?? 0,
                    bookmarkCount: bookmarkCountMap.get(post.id) ?? 0,
                    commentCount: commentCountMap.get(post.id) ?? 0
                })
                const rankedAt = this.getPostRankedAt(post)
                const { hotnessScore, nextHotnessRefreshAt } = this.buildHotnessRefreshData({
                    hotScore,
                    rankedAt,
                    now
                })

                return prisma.post.update({
                    where: { id: post.id },
                    data: { hotScore, hotnessScore, nextHotnessRefreshAt }
                })
            })
        )
    }

    private async recalculateComments(commentIds: Comment['id'][]) {
        const uniqueCommentIds = [...new Set(commentIds)].filter(
            (id) => Number.isInteger(id) && id > 0
        )
        if (!uniqueCommentIds.length) return

        const [comments, reactionCounts, bookmarkCounts, directReplyCounts] = await Promise.all([
            prisma.comment.findMany({
                where: { id: { in: uniqueCommentIds } },
                select: { id: true, createdAt: true }
            }),
            prisma.reactionComment.groupBy({
                by: ['targetCommentId'],
                where: { targetCommentId: { in: uniqueCommentIds } },
                _count: { targetCommentId: true }
            }),
            prisma.bookmarkComment.groupBy({
                by: ['targetCommentId'],
                where: { targetCommentId: { in: uniqueCommentIds } },
                _count: { targetCommentId: true }
            }),
            prisma.comment.groupBy({
                by: ['parentId'],
                where: {
                    parentId: { in: uniqueCommentIds },
                    isDeleted: false
                },
                _count: { parentId: true }
            })
        ])

        if (!comments.length) return

        const reactionCountMap = new Map(
            reactionCounts.map((item) => [item.targetCommentId, item._count.targetCommentId])
        )
        const bookmarkCountMap = new Map(
            bookmarkCounts.map((item) => [item.targetCommentId, item._count.targetCommentId])
        )
        const directReplyCountMap = new Map(
            directReplyCounts
                .filter((item) => item.parentId !== null)
                .map((item) => [item.parentId as number, item._count.parentId ?? 0])
        )
        const now = new Date()

        await prisma.$transaction(
            comments.map((comment) => {
                const hotScore = calculateCommentHotScore({
                    reactionCount: reactionCountMap.get(comment.id) ?? 0,
                    bookmarkCount: bookmarkCountMap.get(comment.id) ?? 0,
                    replyCount: directReplyCountMap.get(comment.id) ?? 0
                })
                const { hotnessScore, nextHotnessRefreshAt } = this.buildHotnessRefreshData({
                    hotScore,
                    rankedAt: comment.createdAt,
                    now
                })

                return prisma.comment.update({
                    where: { id: comment.id },
                    data: { hotScore, hotnessScore, nextHotnessRefreshAt }
                })
            })
        )
    }
}
