'use client'

import { useRouter } from 'next/navigation'
import { PATH } from '@/shared/constants'
import { DropDownFilter, DropDownOption } from '@/shared/ui/dropdown-menu'
import { useMainPageRoute } from '../model/hooks/useMainPageRoute'
import { MAIN_PAGE_SORT } from '../model/page-filters'
import { TMainPageSortAll } from '../types'

export const MainPageSortDropdown = () => {
    const { sectionValue, sortValue } = useMainPageRoute()
    const router = useRouter()

    const handleClick = ({ value }: DropDownOption<TMainPageSortAll>) => {
        router.push(`${PATH.MAIN}/${sectionValue}/${value}`, { scroll: false })
    }

    return (
        <DropDownFilter
            align='end'
            options={MAIN_PAGE_SORT[sectionValue]}
            filter={sortValue}
            onClick={handleClick}
        />
    )
}
