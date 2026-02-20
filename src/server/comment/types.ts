import { Post, User } from '@/shared/services/prisma'
import { TComment, TCommentData } from '@/shared/types/comment.types'
import {
    CreateCommentDTO,
    DeleteCommentDTO,
    GetBookmarkedCommentsDTO,
    GetPostCommentsDTO,
    GetPostThreadDTO,
    GetReactedCommentsDTO,
    GetUserCommentsDTO
} from '@/shared/validation/comment.schema'

export interface ICommentRepository {
    getByIds(ids: TComment['id'][], userId?: User['id']): Promise<TCommentData[]>
    createOne(dto: CreateCommentDTO, userId: User['id']): Promise<TCommentData>
    findPostCommentsWithReplies(
        dto: GetPostCommentsDTO,
        userId?: User['id']
    ): Promise<{
        items: TCommentData[]
        cursor: number | null
        repliesCursorByParent: Record<string, number>
    }>
    findUserComments(
        dto: GetUserCommentsDTO,
        userId?: User['id']
    ): Promise<{ items: TCommentData[]; cursor: number | null }>
    findThread(dto: GetPostThreadDTO): Promise<TCommentData[]>
    softDeleteOne(dto: DeleteCommentDTO, userId: User['id']): Promise<TCommentData>
    deletePostComments(postId: Post['id']): Promise<void>
    getMetrics({ ids }: { ids: Post['id'][] }): Promise<Map<Post['id'], { commentCount: number }>>
}

export interface ICommentEnricher {
    enrich: (comment: TCommentData, userId?: User['id']) => Promise<TComment>
    enrichAll: (comments: TCommentData[], userId?: User['id']) => Promise<TComment[]>
}

export interface ICommentService {
    getByIds(ids: TComment['id'][], userId?: User['id']): Promise<TComment[]>
    createOne(dto: CreateCommentDTO, userId: User['id']): Promise<TComment>
    getPostComments(
        dto: GetPostCommentsDTO,
        userId?: User['id']
    ): Promise<{
        items: TComment[]
        cursor: number | null
        repliesCursorByParent: Record<string, number>
    }>
    getUserComments(
        dto: GetUserCommentsDTO,
        userId?: User['id']
    ): Promise<{ items: TComment[]; cursor: number | null }>
    getPostThread(
        dto: GetPostThreadDTO,
        userId?: User['id']
    ): Promise<{ items: TComment[]; cursor: null }>
    getReactedComments(
        dto: GetReactedCommentsDTO,
        userId: User['id']
    ): Promise<{ items: TComment[]; cursor: number | null }>
    getBookmarkedComments(
        dto: GetBookmarkedCommentsDTO,
        userId: User['id']
    ): Promise<{ items: TComment[]; cursor: number | null }>
    softDeleteOne(dto: DeleteCommentDTO, userId: User['id']): Promise<TComment>
    deletePostComments(postId: Post['id']): Promise<void>
    getMetrics({ ids }: { ids: Post['id'][] }): Promise<Map<Post['id'], { commentCount: number }>>
}

export type JSONContent = {
    [key: string]: unknown
    type?: string
    attrs?: Record<string, unknown> | undefined
    content?: JSONContent[]
    marks?: {
        type: string
        attrs?: Record<string, unknown>
        [key: string]: unknown
    }[]
    text?: string
}
