import { TBookmarkTargetSlug } from '@/shared/types/bookmark.types'
import { TReactionTargetSlug } from '@/shared/types/reaction.types'
import { TDropDownOption } from '@/shared/ui/dropdown-menu'

export type TBookmarksPageSortMap = {
    bookmarks: TDropDownOption<TBookmarkTargetSlug>[]
    reactions: TDropDownOption<TReactionTargetSlug>[]
}

export type TBookmarksPageSlugAll = TBookmarkTargetSlug | TReactionTargetSlug
