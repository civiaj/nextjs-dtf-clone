import { JSONContent } from '@tiptap/core'
import { commentSelect, Prisma } from '@/shared/services/prisma'
import { TResponseBase } from '@/shared/types'
import { TBookmarkMetrics } from '@/shared/types/bookmark.types'
import { TReactionMetrics } from '@/shared/types/reaction.types'
import { TUser } from '@/shared/types/user.types'

export type TCommentSelect = Prisma.CommentGetPayload<{ select: typeof commentSelect }>
export type TCommentData = Omit<TCommentSelect, 'json'> & { json: JSONContent | null }
export type TCommentMetrics = TBookmarkMetrics & TReactionMetrics
export type TComment = Omit<TCommentData, 'user'> & { user: TUser } & TCommentMetrics

export type GetCommentsResponse = TResponseBase<{
    items: TComment[]
    cursor: number | null
    repliesCursorByParent?: Record<string, number>
}>

export const MAIN_PAGE_SECTION = ['popular', 'new', 'my'] as const
export type TMainPageSection = (typeof MAIN_PAGE_SECTION)[number]

export const USER_PAGE_SECTION = ['posts', 'comments'] as const
export type TUserPageSection = (typeof USER_PAGE_SECTION)[number]

export const BOOKMARKS_PAGE_SECTION = ['bookmarks', 'reactions'] as const
export type TBookmarksPageSection = (typeof BOOKMARKS_PAGE_SECTION)[number]
