'use client'

import { useRouter } from 'next/navigation'
import { PATH } from '@/shared/constants'
import { DropDownFilter, TDropDownOption } from '@/shared/ui/dropdown-menu'
import { useBookmarksPageRoute } from '../model/hooks/useBookmarksPageRoute'
import { BOOKMARKS_PAGE_SORT } from '../model/page-filters'
import { TBookmarksPageSlugAll } from '../types'

export const BookmarksPageSortDropdown = () => {
    const { sectionValue, slugValue } = useBookmarksPageRoute()
    const router = useRouter()

    const onClick = (option: TDropDownOption<TBookmarksPageSlugAll>) => {
        router.push(`${PATH.MAIN}/${sectionValue}/${option.value}`, { scroll: false })
    }

    return (
        <DropDownFilter
            align='end'
            filter={slugValue}
            options={BOOKMARKS_PAGE_SORT[sectionValue]}
            onClick={onClick}
        />
    )
}
