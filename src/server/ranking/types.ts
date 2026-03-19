import { Comment, Post } from '@/shared/services/prisma'

export type TRankingTarget = 'POST' | 'COMMENT'
export type THotnessRefreshResult = { postCount: number; commentCount: number }

export interface IRankingService {
    recalculateByTarget(target: TRankingTarget, targetId: number): Promise<void>
    recalculatePost(postId: Post['id']): Promise<void>
    recalculateComment(commentId: Comment['id']): Promise<void>
    recalculateParentCommentByReply(commentId: Comment['id']): Promise<void>
    refreshHotnessScores(): Promise<THotnessRefreshResult>
}
