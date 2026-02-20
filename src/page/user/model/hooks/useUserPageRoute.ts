'use client'

import { notFound, usePathname } from 'next/navigation'
import { PATH } from '@/shared/constants'
import { TUserPageSection, USER_PAGE_SECTION } from '@/shared/types/comment.types'
import { USER_PAGE_SORT } from '../../constants'
import { TUserPageSortValueMap } from '../../types'

type TUserPageRoute =
    | {
          idValue: number
          sectionValue: 'posts'
          sortValue: TUserPageSortValueMap['posts']
      }
    | {
          idValue: number
          sectionValue: 'comments'
          sortValue: TUserPageSortValueMap['comments']
      }

const USER_PATH_SEGMENT = PATH.USER.slice(1)

export const useUserPageRoute = (): TUserPageRoute => {
    const pathname = usePathname()
    const [pathSegment, idSegment, sectionSegment, sortSegment, ...restSegments] = pathname
        .split('/')
        .filter(Boolean)

    if (pathSegment !== USER_PATH_SEGMENT || restSegments.length > 0) {
        return notFound()
    }

    if (!isPositiveIntegerString(idSegment)) {
        return notFound()
    }
    const idValue = Number(idSegment)

    const sectionValue = sectionSegment ?? USER_PAGE_SECTION[0]
    if (!isUserPageSection(sectionValue)) {
        return notFound()
    }

    if (sectionValue === 'posts') {
        return {
            idValue,
            sectionValue,
            sortValue: getUserPageSortValue(sectionValue, sortSegment)
        }
    }

    return {
        idValue,
        sectionValue,
        sortValue: getUserPageSortValue(sectionValue, sortSegment)
    }
}

const isPositiveIntegerString = (value: unknown): value is `${number}` => {
    if (typeof value !== 'string') return false
    const numberValue = Number(value)
    return Number.isInteger(numberValue) && numberValue > 0
}

const isUserPageSection = (value: unknown): value is TUserPageSection => {
    return (USER_PAGE_SECTION as readonly string[]).includes(value as string)
}

const isUserPageSort = <TSection extends TUserPageSection>(
    value: unknown,
    section: TSection
): value is TUserPageSortValueMap[TSection] => {
    return USER_PAGE_SORT[section].some((option) => option.value === value)
}

const getUserPageSortValue = <TSection extends TUserPageSection>(
    section: TSection,
    sortSegment: unknown
): TUserPageSortValueMap[TSection] => {
    const defaultSortValue = USER_PAGE_SORT[section][0]?.value
    if (defaultSortValue === undefined) {
        return notFound()
    }

    const sortValue = typeof sortSegment === 'string' ? sortSegment : defaultSortValue
    if (!isUserPageSort(sortValue, section)) {
        return notFound()
    }

    return sortValue
}
