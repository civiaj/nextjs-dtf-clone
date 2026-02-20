import { ApiError } from '@/lib/error'
import { IBookmarkService } from '@/server/bookmark'
import { ICommentService } from '@/server/comment'
import { IFollowUserService } from '@/server/follow-user'
import { IMuteService } from '@/server/mute'
import { IPostEnricher } from '@/server/post/types'
import { IReactionService } from '@/server/reaction/types'
import { ERROR_MESSAGES } from '@/shared/constants'
import { User } from '@/shared/services/prisma'
import { TPost, TPostData } from '@/shared/types/post.types'

export class PostEnricher implements IPostEnricher {
    constructor(
        private FollowUserService: IFollowUserService,
        private MuteService: IMuteService,
        private CommentService: ICommentService,
        private ReactionService: IReactionService,
        private BookmarkService: IBookmarkService
    ) {}

    async enrich(post: TPostData, userId?: User['id']) {
        if (!post) throw ApiError.BadRequest(ERROR_MESSAGES.USER.USER_NOT_FOUND)
        const [enriched] = await this.enrichAll([post], userId)
        return enriched
    }

    async enrichAll(posts: TPostData[], userId?: User['id']): Promise<TPost[]> {
        const userIds = [...new Set(posts.map((p) => p.user.id))]
        const postIds = [...new Set(posts.map((p) => p.id))]

        const [
            followMetrics,
            userMuteMetrics,
            postMuteMetrics,
            commentMetrics,
            reactionMetrics,
            bookmarkMetrics
        ] = await Promise.all([
            this.FollowUserService.getMetrics({ ids: userIds, userId }),
            this.MuteService.getMetrics({ ids: userIds, userId, target: 'USER' }),
            this.MuteService.getMetrics({ ids: postIds, userId, target: 'POST' }),
            this.CommentService.getMetrics({ ids: postIds }),
            this.ReactionService.getMetrics({ ids: postIds, target: 'POST', userId }),
            this.BookmarkService.getMetrics({ ids: postIds, target: 'POST', userId })
        ])

        return posts.map((p) => ({
            ...p,
            ...postMuteMetrics.get(p.id)!,
            ...commentMetrics.get(p.id)!,
            ...reactionMetrics.get(p.id)!,
            ...bookmarkMetrics.get(p.id)!,
            user: {
                ...p.user,
                ...followMetrics.get(p.user.id)!,
                ...userMuteMetrics.get(p.user.id)!
            }
        }))
    }
}
