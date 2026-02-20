'use client'

import { useRouter } from 'next/navigation'
import { PATH } from '@/shared/constants'
import { DropDownFilter, TDropDownOption } from '@/shared/ui/dropdown-menu'
import { useMainPageRoute } from '../model/hooks/useMainPageRoute'
import { MAIN_PAGE_SORT } from '../model/page-filters'
import { TMainPageSortAll } from '../types'

export const MainPageSortDropdown = () => {
    const { sectionValue, sortValue } = useMainPageRoute()
    const router = useRouter()

    const onClick = (option: TDropDownOption<TMainPageSortAll>) => {
        router.push(`${PATH.MAIN}/${sectionValue}/${option.value}`, { scroll: false })
    }

    return (
        <DropDownFilter
            align='end'
            filter={sortValue}
            options={MAIN_PAGE_SORT[sectionValue]}
            onClick={onClick}
        />
    )
}
