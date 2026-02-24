import { BookmarksSlug, ReactionsSlug } from '@/page/bookmarks/model/types'
import { PATH } from '@/shared/constants'
import { BookmarksPageSection } from '@/shared/types/comment.types'
import { DropDownOption } from '@/shared/ui/dropdown-menu'
import { TLinksBarItem } from '@/shared/ui/LinksBar'

const BOOKMARKS_SORT_OPTIONS: DropDownOption<BookmarksSlug>[] = [
    { label: 'Посты', value: 'posts' },
    { label: 'Комментарии', value: 'comments' }
]

const REACTIONS_SORT_OPTIONS: DropDownOption<ReactionsSlug>[] = [
    { label: 'Посты', value: 'posts' },
    { label: 'Комментарии', value: 'comments' }
]

export const BOOKMARKS_PAGE_SORT_OPTIONS = {
    reactions: REACTIONS_SORT_OPTIONS,
    bookmarks: BOOKMARKS_SORT_OPTIONS
} as const satisfies Record<
    BookmarksPageSection,
    (DropDownOption<BookmarksSlug> | DropDownOption<ReactionsSlug>)[]
>

export const BOOKMARKS_PAGE_NAV_LINKS: TLinksBarItem[] = [
    {
        href: PATH.BOOKMARKS,
        label: 'Закладки',
        match: 'startsWith',
        isDefaultActive: true
    },
    {
        href: PATH.BOOKMARKS_REACTIONS,
        label: 'Реакции',
        match: 'startsWith'
    }
]
