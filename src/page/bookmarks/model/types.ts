import { ReactionTarget } from '@/shared/types/reaction.types'
import { BookmarkTarget } from '@/shared/validation/bookmark.schema'

const _bookmarksSlugMapper = {
    posts: 'POST',
    comments: 'COMMENT'
} as const satisfies Record<string, BookmarkTarget>

const _reactionsSlugMapper = {
    posts: 'POST',
    comments: 'COMMENT'
} as const satisfies Record<string, ReactionTarget>

export type BookmarksSlug = keyof typeof _bookmarksSlugMapper
export type ReactionsSlug = keyof typeof _reactionsSlugMapper
export type BookmarksPageSlug = BookmarksSlug | ReactionsSlug
