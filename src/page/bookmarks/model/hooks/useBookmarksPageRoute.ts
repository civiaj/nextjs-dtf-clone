'use client'

import { notFound, usePathname } from 'next/navigation'
import { BOOKMARKS_PAGE_SECTION, BookmarksPageSection } from '@/shared/types/comment.types'
import { BOOKMARKS_PAGE_SORT_OPTIONS } from '../constants'
import { BookmarksPageSlug } from '../types'

export const useBookmarksPageRoute = (): {
    slugValue: BookmarksPageSlug
    sectionValue: BookmarksPageSection
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
        const filters = BOOKMARKS_PAGE_SORT_OPTIONS[sectionValue as BookmarksPageSection]
        slugValue = filters[0].value
    } else if (!isBookmarksPageSort(slugValue, sectionValue)) {
        return notFound()
    }

    return {
        sectionValue: sectionValue as BookmarksPageSection,
        slugValue: slugValue as BookmarksPageSlug
    }
}

const isBookmarksPageSection = (value: unknown): value is BookmarksPageSection => {
    return BOOKMARKS_PAGE_SECTION.includes(value as BookmarksPageSection)
}

const isBookmarksPageSort = (
    value: unknown,
    section: BookmarksPageSection
): value is BookmarksPageSlug => {
    return BOOKMARKS_PAGE_SORT_OPTIONS[section]
        .map(({ value }) => value)
        .includes(value as BookmarksPageSlug)
}
