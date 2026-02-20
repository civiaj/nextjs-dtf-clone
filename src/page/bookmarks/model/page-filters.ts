import { TBookmarkTargetSlug } from '@/shared/types/bookmark.types'
import { TReactionTargetSlug } from '@/shared/types/reaction.types'
import { TDropDownOption } from '@/shared/ui/dropdown-menu'
import { TBookmarksPageSortMap } from '../types'

const BOOKMARKS_PAGE_BOOKMARK_SORT: TDropDownOption<TBookmarkTargetSlug>[] = [
    { label: 'Посты', value: 'posts' },
    { label: 'Комментарии', value: 'comments' }
]

const BOOKMARKS_PAGE_REACTION_SORT: TDropDownOption<TReactionTargetSlug>[] = [
    { label: 'Посты', value: 'posts' },
    { label: 'Комментарии', value: 'comments' }
]

export const BOOKMARKS_PAGE_SORT: TBookmarksPageSortMap = {
    bookmarks: BOOKMARKS_PAGE_BOOKMARK_SORT,
    reactions: BOOKMARKS_PAGE_REACTION_SORT
}
