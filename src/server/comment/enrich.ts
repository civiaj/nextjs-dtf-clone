import { ApiError } from '@/lib/error'
import { IBookmarkService } from '@/server/bookmark'
import { ICommentEnricher } from '@/server/comment/types'
import { IFollowUserService } from '@/server/follow-user'
import { IMuteService } from '@/server/mute'
import { IReactionService } from '@/server/reaction'
import { ERROR_MESSAGES } from '@/shared/constants'
import { User } from '@/shared/services/prisma'
import { TCommentData } from '@/shared/types/comment.types'

export class CommentEnricher implements ICommentEnricher {
    constructor(
        private FollowUserService: IFollowUserService,
        private MuteService: IMuteService,
        private ReactionService: IReactionService,
        private BookmarkService: IBookmarkService
    ) {}
    async enrich(comment: TCommentData, userId?: User['id']) {
        if (!comment) throw ApiError.BadRequest(ERROR_MESSAGES.COMMENT.NOT_FOUND)
        const [enriched] = await this.enrichAll([comment], userId)
        return enriched
    }
    async enrichAll(comments: TCommentData[], userId?: User['id']) {
        const userIds = [...new Set(comments.map((c) => c.user.id))]
        const commentIds = [...new Set(comments.map((c) => c.id))]

        const [followMetrics, userMuteMetrics, reactionMetrics, bookmarkMetrics] =
            await Promise.all([
                this.FollowUserService.getMetrics({ ids: userIds, userId }),
                this.MuteService.getMetrics({ ids: userIds, userId, target: 'USER' }),
                this.ReactionService.getMetrics({ ids: commentIds, target: 'COMMENT', userId }),
                this.BookmarkService.getMetrics({ ids: commentIds, target: 'COMMENT', userId })
            ])

        return comments.map((c) => ({
            ...c,
            ...reactionMetrics.get(c.id)!,
            ...bookmarkMetrics.get(c.id)!,
            user: {
                ...c.user,
                ...followMetrics.get(c.user.id)!,
                ...userMuteMetrics.get(c.user.id)!
            }
        }))
    }
}
