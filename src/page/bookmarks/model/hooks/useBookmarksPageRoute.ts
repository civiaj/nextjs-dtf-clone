'use client'

import { notFound, usePathname } from 'next/navigation'
import { BOOKMARKS_PAGE_SECTION, TBookmarksPageSection } from '@/shared/types/comment.types'
import { TBookmarksPageSlugAll } from '../../types'
import { BOOKMARKS_PAGE_SORT } from '../page-filters'

export const useBookmarksPageRoute = (): {
    slugValue: TBookmarksPageSlugAll
    sectionValue: TBookmarksPageSection
} => {
    const pathname = usePathname()
    const segments = pathname.split('/').filter(Boolean)
    if (segments.length > 2) return notFound()

    const sectionValue = segments[0]
    let slugValue = segments[1]

    if (!sectionValue || !isBookmarksPageSection(sectionValue)) {
        return notFound()
    }

    if (!slugValue) {
        const filters = BOOKMARKS_PAGE_SORT[sectionValue as TBookmarksPageSection]
        slugValue = filters[0].value
    } else if (!isBookmarksPageSort(slugValue, sectionValue)) {
        return notFound()
    }

    return {
        sectionValue: sectionValue as TBookmarksPageSection,
        slugValue: slugValue as TBookmarksPageSlugAll
    }
}

const isBookmarksPageSection = (value: unknown): value is TBookmarksPageSection => {
    return BOOKMARKS_PAGE_SECTION.includes(value as TBookmarksPageSection)
}

const isBookmarksPageSort = (
    value: unknown,
    section: TBookmarksPageSection
): value is TBookmarksPageSlugAll => {
    return BOOKMARKS_PAGE_SORT[section]
        .map(({ value }) => value)
        .includes(value as TBookmarksPageSlugAll)
}
