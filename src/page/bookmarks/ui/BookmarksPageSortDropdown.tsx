'use client'

import { useRouter } from 'next/navigation'
import { PATH } from '@/shared/constants'
import { DropDownFilter, DropDownOption } from '@/shared/ui/dropdown-menu'
import { BOOKMARKS_PAGE_SORT_OPTIONS } from '../model/constants'
import { useBookmarksPageRoute } from '../model/hooks/useBookmarksPageRoute'
import { BookmarksPageSlug } from '../model/types'

export const BookmarksPageSortDropdown = () => {
    const { sectionValue, slugValue } = useBookmarksPageRoute()
    const router = useRouter()

    const handleClick = ({ value }: DropDownOption<BookmarksPageSlug>) => {
        router.push(`${PATH.MAIN}/${sectionValue}/${value}`, { scroll: false })
    }

    return (
        <DropDownFilter
            options={BOOKMARKS_PAGE_SORT_OPTIONS[sectionValue]}
            filter={slugValue}
            onClick={handleClick}
        />
    )
}
