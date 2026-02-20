import { useAppSelector } from '@/lib/store'
import { PATH } from '@/shared/constants'
import { BookmarkAppIcon, HouseAppIcon, SearchAppIcon, UserAppIcon } from '@/shared/icons'
import { BOOKMARKS_PAGE_SECTION, MAIN_PAGE_SECTION } from '@/shared/types/comment.types'
import { TSidebarItem } from '../../types'

export const useSidebarItems = () => {
    const staleUser = useAppSelector((state) => state.auth.staleUser)
    const defaultFeed = useAppSelector((state) => state.ui.defaultFeed)
    const content: TSidebarItem[] = [
        {
            label: 'Главная',
            href: `${PATH.MAIN}/${defaultFeed}`,
            Icon: HouseAppIcon,
            match: (pathname) => MAIN_PAGE_SECTION.some((path) => pathname.startsWith('/' + path))
        }
    ]

    if (staleUser) {
        content.push(
            {
                label: 'Профиль',
                href: `${PATH.USER}/${staleUser.id}`,
                Icon: UserAppIcon,
                match: (pathname) => pathname.startsWith(`${PATH.USER}`)
            },
            {
                label: 'Закладки',
                href: `${PATH.BOOKMARKS}`,
                Icon: BookmarkAppIcon,
                match: (pathname) =>
                    BOOKMARKS_PAGE_SECTION.some((path) => pathname.startsWith('/' + path))
            }
        )
    }

    content.push({
        label: 'Поиск',
        href: PATH.SETTINGS,
        Icon: SearchAppIcon,
        match: (pathname) => pathname.startsWith(`${PATH.SETTINGS}`)
    })

    return content
}
