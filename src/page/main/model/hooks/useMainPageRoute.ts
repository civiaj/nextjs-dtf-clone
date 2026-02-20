'use client'

import { notFound, redirect, usePathname } from 'next/navigation'
import { useAppSelector } from '@/lib/store'
import { PATH } from '@/shared/constants'
import { MAIN_PAGE_SECTION, TMainPageSection } from '@/shared/types/comment.types'
import { TMainPageSortAll } from '../../types'
import { MAIN_PAGE_SORT } from '../page-filters'

export const useMainPageRoute = (): {
    sortValue: TMainPageSortAll
    sectionValue: TMainPageSection
} => {
    const defaultFeed = useAppSelector((state) => state.ui.defaultFeed)
    const pathname = usePathname()
    const segments = pathname.split('/').filter(Boolean)
    if (segments.length > 2) return notFound()

    const sectionValue = segments[0]
    let sortValue = segments[1]

    if (!sectionValue) {
        return redirect(`${PATH.MAIN}/${defaultFeed}`)
    } else if (!isMainPageSection(sectionValue)) {
        return notFound()
    }

    if (!sortValue) {
        const filters = MAIN_PAGE_SORT[sectionValue]
        sortValue = filters[0].value
    } else if (!isMainPageSort(sortValue, sectionValue)) {
        return notFound()
    }

    return {
        sectionValue: sectionValue as TMainPageSection,
        sortValue: sortValue as TMainPageSortAll
    }
}

const isMainPageSection = (value: unknown): value is TMainPageSection => {
    return MAIN_PAGE_SECTION.includes(value as TMainPageSection)
}

const isMainPageSort = (value: unknown, section: TMainPageSection): value is TMainPageSortAll => {
    return MAIN_PAGE_SORT[section].map(({ value }) => value).includes(value as TMainPageSortAll)
}
