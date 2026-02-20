import { Post, User } from '@/shared/services/prisma'
import { TPost, TPostData } from '@/shared/types/post.types'
import {
    GetOwnerDraftsDTO,
    GetFeedPostsDTO,
    GetUserPostsDTO,
    DeletePostDTO,
    UpdatePostDTO,
    PublishPostDTO,
    GetOwnerBookmaredPostsDTO,
    GetOwnerReactedPostsDTO,
    GetOwnerMutedPostsInput
} from '@/shared/validation/post.schema'

export interface IPostEnricher {
    enrich: (post: TPostData, userId?: User['id']) => Promise<TPost>
    enrichAll: (posts: TPostData[], userId?: User['id']) => Promise<TPost[]>
}

export interface IPostRepository {
    getById(id: Post['id']): Promise<TPostData | null>
    getBySlug(slug: Post['slug']): Promise<TPostData | null>
    getByIds(ids: Post['id'][]): Promise<TPostData[]>
    getFeedPosts(
        dto: GetFeedPostsDTO,
        userId?: User['id']
    ): Promise<{ items: TPostData[]; cursor: number | null }>
    getUserPosts(dto: GetUserPostsDTO): Promise<{ items: TPostData[]; cursor: number | null }>
    getOwnerDrafts(
        dto: GetOwnerDraftsDTO,
        userId: User['id']
    ): Promise<{ items: TPostData[]; cursor: number | null }>
    updateOne(dto: UpdatePostDTO, usrerId: User['id']): Promise<TPostData>
    deleteOne(dto: DeletePostDTO, userId: User['id']): Promise<TPostData>
    softDeleteOne(dto: DeletePostDTO, userId: User['id']): Promise<TPostData>
    publish(dto: PublishPostDTO, userId: User['id']): Promise<TPostData | null>
}

export interface IPostService {
    getById(id: Post['id'], userId?: User['id']): Promise<TPost>
    getBySlug(slug: Post['slug'], userId?: User['id']): Promise<TPost>
    getByIds(ids: Post['id'][]): Promise<TPost[]>
    getFeedPosts(
        dto: GetFeedPostsDTO,
        userId?: User['id']
    ): Promise<{ items: TPost[]; cursor: number | null }>
    getUserPosts(
        dto: GetUserPostsDTO,
        userId?: User['id']
    ): Promise<{ items: TPost[]; cursor: number | null }>
    getOwnerDrafts(
        dto: GetOwnerDraftsDTO,
        userId: User['id']
    ): Promise<{ items: TPost[]; cursor: number | null }>
    getOwnerBookmarkedPosts(
        dto: GetOwnerBookmaredPostsDTO,
        userId: User['id']
    ): Promise<{ items: TPost[]; cursor: number | null }>
    getOwnerReactedPosts(
        dto: GetOwnerReactedPostsDTO,
        userId: User['id']
    ): Promise<{ items: TPost[]; cursor: number | null }>
    getOwnerMutedPosts(
        dto: GetOwnerMutedPostsInput,
        userId: User['id']
    ): Promise<{ items: TPost[]; cursor: number | null }>
    updateOne(dto: UpdatePostDTO, userId: User['id']): Promise<TPost>
    deleteOne(dto: DeletePostDTO, userId: User['id']): Promise<TPost>
    publish(dto: PublishPostDTO, userId: User['id']): Promise<TPost | null>
}
