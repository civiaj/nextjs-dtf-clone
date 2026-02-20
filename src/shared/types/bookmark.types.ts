import { Prisma, bookmarkCommentSelect, bookmarkPostSelect } from '@/shared/services/prisma'
import { TComment } from '@/shared/types/comment.types'
import { TPost } from '@/shared/types/post.types'
import { BookmarkTarget } from '@/shared/validation/bookmark.schema'

export const bookmarkTargetSlugMap = {
    posts: 'POST',
    comments: 'COMMENT'
} as const satisfies Record<string, BookmarkTarget>

export type TBookmarkTargetSlug = keyof typeof bookmarkTargetSlugMap

export type TBookmarkPostSelect = Prisma.BookmarkPostGetPayload<{
    select: typeof bookmarkPostSelect
}>
export type TBookmarkCommentSelect = Prisma.BookmarkCommentGetPayload<{
    select: typeof bookmarkCommentSelect
}>

export type TBookmarkMetrics = {
    bookmarkCount: number
    isBookmarked: boolean
}

export type TBookmarkConfig = {
    POST: {
        select: TBookmarkPostSelect
        metrics: Map<TPost['id'], TBookmarkMetrics>
        id: TPost['id']
    }
    COMMENT: {
        select: TBookmarkCommentSelect
        metrics: Map<TComment['id'], TBookmarkMetrics>
        id: TComment['id']
    }
}
