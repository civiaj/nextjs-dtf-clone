import { ApiError } from '@/lib/error'
import { IBookmarkService } from '@/server/bookmark'
import { IReactionService } from '@/server/reaction'
import { IUserService } from '@/server/user'
import { ERROR_MESSAGES } from '@/shared/constants'
import { Post, User } from '@/shared/services/prisma'
import { TComment } from '@/shared/types/comment.types'
import {
    CreateCommentDTO,
    DeleteCommentDTO,
    GetBookmarkedCommentsDTO,
    GetPostCommentsDTO,
    GetPostThreadDTO,
    GetReactedCommentsDTO,
    GetUserCommentsDTO
} from '@/shared/validation/comment.schema'
import { ICommentRepository, ICommentService, ICommentEnricher } from './types'
import { commentDocumentHandler } from './utils'

export class CommentService implements ICommentService {
    constructor(
        private commentRepository: ICommentRepository,
        private bookmarkService: IBookmarkService,
        private reactionService: IReactionService,
        private userService: IUserService,
        private commentEnricher: ICommentEnricher
    ) {}

    async getByIds(ids: TComment['id'][], userId?: User['id']) {
        const items = await this.commentRepository.getByIds(ids)
        return await this.commentEnricher.enrichAll(items, userId)
    }

    async createOne(dto: CreateCommentDTO, userId: User['id']) {
        const mentionIds = commentDocumentHandler.extractMentionIds(dto.json)
        await this.validateMentionedUsers(mentionIds)
        const comment = await this.commentRepository.createOne(dto, userId)
        return await this.commentEnricher.enrich(comment, userId)
    }

    async getPostComments(
        dto: GetPostCommentsDTO,
        userId?: User['id']
    ): Promise<{
        items: TComment[]
        cursor: number | null
        repliesCursorByParent: Record<string, number>
    }> {
        const result = await this.commentRepository.findPostCommentsWithReplies(dto, userId)
        return {
            cursor: result.cursor,
            items: await this.commentEnricher.enrichAll(result.items, userId),
            repliesCursorByParent: result.repliesCursorByParent
        }
    }

    async getUserComments(dto: GetUserCommentsDTO, userId?: User['id']) {
        const result = await this.commentRepository.findUserComments(dto)
        return {
            cursor: result.cursor,
            items: await this.commentEnricher.enrichAll(result.items, userId)
        }
    }

    async getPostThread(dto: GetPostThreadDTO, userId?: User['id']) {
        const result = await this.commentRepository.findThread(dto)
        return { items: await this.commentEnricher.enrichAll(result, userId), cursor: null }
    }

    async getReactedComments(dto: GetReactedCommentsDTO, userId: User['id']) {
        const { cursor, items: reactions } = await this.reactionService.getAll({
            userId,
            target: 'COMMENT',
            ...dto
        })
        const posts = await this.getByIds(
            reactions.map((b) => b.targetCommentId),
            userId
        )
        return { items: posts, cursor }
    }

    async getBookmarkedComments(dto: GetBookmarkedCommentsDTO, userId: User['id']) {
        const { cursor, items: bookmarks } = await this.bookmarkService.getAll({
            userId,
            target: 'COMMENT',
            ...dto
        })

        const posts = await this.getByIds(
            bookmarks.map((b) => b.targetCommentId),
            userId
        )
        return { items: posts, cursor }
    }

    async softDeleteOne(dto: DeleteCommentDTO, userId: User['id']) {
        const result = await this.commentRepository.softDeleteOne(dto, userId)
        return await this.commentEnricher.enrich(result)
    }

    async deletePostComments(postId: Post['id']) {
        await this.commentRepository.deletePostComments(postId)
    }

    async getMetrics({ ids }: { ids: Post['id'][] }) {
        return await this.commentRepository.getMetrics({ ids })
    }

    async validateMentionedUsers(userIds: User['id'][]) {
        const existingUsers = await this.userService.getByIds(userIds)
        const existingUserIds = new Set(existingUsers.map((u) => u.id))
        const invalidUserIds = userIds.filter((id) => !existingUserIds.has(id))

        if (invalidUserIds.length > 0) {
            throw ApiError.BadRequest(ERROR_MESSAGES.COMMENT.INVALID_USER_IDS)
        }
    }
}
