import { ApiError } from '@/lib/error'
import { IBookmarkService } from '@/server/bookmark'
import { IMuteService } from '@/server/mute'
import { IReactionService } from '@/server/reaction'
import { ERROR_MESSAGES } from '@/shared/constants'
import { Post, User } from '@/shared/services/prisma'
import {
    DeletePostDTO,
    GetOwnerBookmaredPostsDTO,
    GetOwnerDraftsDTO,
    GetFeedPostsDTO,
    GetOwnerReactedPostsDTO,
    GetOwnerMutedPostsInput,
    GetUserPostsDTO,
    PublishPostDTO,
    UpdatePostDTO
} from '@/shared/validation/post.schema'
import { IPostEnricher, IPostRepository, IPostService } from './types'

export class PostService implements IPostService {
    constructor(
        private postRepository: IPostRepository,
        private bookmarkService: IBookmarkService,
        private reactionService: IReactionService,
        private muteService: IMuteService,
        private postEnricher: IPostEnricher
    ) {}

    async getById(id: Post['id'], userId?: User['id']) {
        const post = await this.postRepository.getById(id)
        if (!post || (post.status === 'DRAFT' && userId !== post.user.id)) {
            throw ApiError.NotFound(ERROR_MESSAGES.POST.NOT_FOUND)
        }
        return await this.postEnricher.enrich(post, userId)
    }

    async getBySlug(slug: Post['slug'], userId?: User['id']) {
        const post = await this.postRepository.getBySlug(slug)
        if (!post) throw ApiError.NotFound(ERROR_MESSAGES.POST.NOT_FOUND)
        return await this.postEnricher.enrich(post, userId)
    }

    async getByIds(ids: Post['id'][], userId?: User['id']) {
        const posts = await this.postRepository.getByIds(ids)
        return await this.postEnricher.enrichAll(posts, userId)
    }

    async getFeedPosts(dto: GetFeedPostsDTO, userId?: User['id']) {
        const { cursor, items } = await this.postRepository.getFeedPosts(dto, userId)
        return { cursor, items: await this.postEnricher.enrichAll(items, userId) }
    }

    async getOwnerDrafts(dto: GetOwnerDraftsDTO, userId: User['id']) {
        const { cursor, items } = await this.postRepository.getOwnerDrafts(dto, userId)
        return { cursor, items: await this.postEnricher.enrichAll(items, userId) }
    }

    async getUserPosts(dto: GetUserPostsDTO, userId?: User['id']) {
        const { cursor, items } = await this.postRepository.getUserPosts(dto)
        return { cursor, items: await this.postEnricher.enrichAll(items, userId) }
    }

    async getOwnerBookmarkedPosts(dto: GetOwnerBookmaredPostsDTO, userId: User['id']) {
        const { cursor, items: bookmarks } = await this.bookmarkService.getAll({
            userId,
            target: 'POST',
            ...dto
        })
        const posts = await this.getByIds(
            bookmarks.map((b) => b.targetPostId),
            userId
        )
        return { items: posts, cursor }
    }

    async getOwnerReactedPosts(dto: GetOwnerReactedPostsDTO, userId: User['id']) {
        const { cursor, items: reactions } = await this.reactionService.getAll({
            userId,
            target: 'POST',
            ...dto
        })
        const posts = await this.getByIds(
            reactions.map((b) => b.targetPostId),
            userId
        )
        return { items: posts, cursor }
    }

    async getOwnerMutedPosts(dto: GetOwnerMutedPostsInput, userId: User['id']) {
        const { cursor, items: mutes } = await this.muteService.getAll({
            userId,
            target: 'POST',
            ...dto
        })
        const posts = await this.getByIds(
            mutes.map((b) => b.targetPostId),
            userId
        )
        return { items: posts, cursor }
    }

    async publish(dto: PublishPostDTO, userId: User['id']) {
        const result = await this.postRepository.publish(dto, userId)
        if (!result) throw ApiError.NotFound(ERROR_MESSAGES.DRAFT.NOT_FOUND)
        return await this.postEnricher.enrich(result, userId)
    }

    async updateOne(dto: UpdatePostDTO, userId: User['id']) {
        const result = await this.postRepository.updateOne(dto, userId)
        return await this.postEnricher.enrich(result, userId)
    }

    async deleteOne(dto: DeletePostDTO, userId: User['id']) {
        const result = await this.postRepository.deleteOne(dto, userId)
        return await this.postEnricher.enrich(result, userId)
    }
}
