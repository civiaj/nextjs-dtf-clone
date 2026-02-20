import { PATH } from '@/shared/constants'
import { TLinksBarItem } from '@/shared/ui/LinksBar'

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
