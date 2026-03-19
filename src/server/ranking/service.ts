import { Comment, Post, prisma } from '@/shared/services/prisma'
import { HOTNESS_REFRESH_WINDOW_HOURS, HOTNESS_TIME_DELAY_HOURS } from './constants'
import {
    calculateCommentHotScore,
    calculateHotnessScore,
    calculatePostHotScore,
    subtractHours
} from './formula'
import { IRankingService, THotnessRefreshResult, TRankingTarget } from './types'

export class RankingService implements IRankingService {
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
        const [posts, comments] = await Promise.all([
            prisma.post.findMany({
                where: {
                    status: 'PUBLISHED',
                    publishedAt: {
                        gte: subtractHours(now, HOTNESS_REFRESH_WINDOW_HOURS),
                        lte: subtractHours(now, HOTNESS_TIME_DELAY_HOURS)
                    },
                    OR: [{ hotScore: { gt: 0 } }, { hotnessScore: { gt: 0 } }]
                },
                select: { id: true, hotScore: true, publishedAt: true, createdAt: true }
            }),
            prisma.comment.findMany({
                where: {
                    isDeleted: false,
                    createdAt: { gte: subtractHours(now, HOTNESS_REFRESH_WINDOW_HOURS) },
                    OR: [{ hotScore: { gt: 0 } }, { hotnessScore: { gt: 0 } }]
                },
                select: { id: true, hotScore: true, createdAt: true }
            })
        ])

        if (!posts.length && !comments.length) return { postCount: 0, commentCount: 0 }

        await prisma.$transaction([
            ...posts.map((post) =>
                prisma.post.update({
                    where: { id: post.id },
                    data: {
                        hotnessScore: calculateHotnessScore({
                            hotScore: post.hotScore,
                            createdAt: post.publishedAt ?? post.createdAt,
                            now
                        })
                    }
                })
            ),
            ...comments.map((comment) =>
                prisma.comment.update({
                    where: { id: comment.id },
                    data: {
                        hotnessScore: calculateHotnessScore({
                            hotScore: comment.hotScore,
                            createdAt: comment.createdAt,
                            now
                        })
                    }
                })
            )
        ])

        return {
            postCount: posts.length,
            commentCount: comments.length
        }
    }

    async recalculatePost(postId: Post['id']) {
        await this.recalculatePosts([postId])
    }

    async recalculateComment(commentId: Comment['id']) {
        await this.recalculateComments([commentId])
    }

    async recalculateParentCommentByReply(commentId: Comment['id']) {
        const comment = await prisma.comment.findUnique({
            where: { id: commentId },
            select: { parentId: true }
        })

        if (!comment?.parentId) return
        await this.recalculateComments([comment.parentId])
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

                const hotnessScore = calculateHotnessScore({
                    hotScore,
                    createdAt: post.publishedAt ?? post.createdAt,
                    now
                })

                return prisma.post.update({
                    where: { id: post.id },
                    data: { hotScore, hotnessScore }
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

                const hotnessScore = calculateHotnessScore({
                    hotScore,
                    createdAt: comment.createdAt,
                    now
                })

                return prisma.comment.update({
                    where: { id: comment.id },
                    data: { hotScore, hotnessScore }
                })
            })
        )
    }
}
