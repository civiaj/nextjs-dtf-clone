import { PATH } from '@/shared/constants'
import { TLinksBarItem } from '@/shared/ui/LinksBar'

export const MAIN_PAGE_NAV_LINKS: TLinksBarItem[] = [
    {
        href: PATH.MAIN_POPULAR,
        label: 'Популярное',
        match: 'startsWith',
        isDefaultActive: true
    },
    {
        href: PATH.MAIN_NEW,
        label: 'Свежее',
        match: 'startsWith'
    },
    {
        href: PATH.MAIN_SELF,
        label: 'Моя лента',
        match: 'startsWith'
    }
]
