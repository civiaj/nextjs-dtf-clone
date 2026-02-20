import { useRouter } from 'next/navigation'
import { PATH } from '@/shared/constants'
import { DropDownFilter } from '@/shared/ui/dropdown-menu'
import { USER_PAGE_SORT } from '../constants'
import { useUserPageRoute } from '../model/hooks/useUserPageRoute'

export const UserPageSortDropdown = () => {
    const { sectionValue, sortValue, idValue } = useUserPageRoute()
    const router = useRouter()
    const createUrl = (value: string) => `${PATH.USER}/${idValue}/${sectionValue}/${value}`

    if (sectionValue === 'posts') {
        return (
            <DropDownFilter
                align='end'
                filter={sortValue}
                options={USER_PAGE_SORT.posts}
                onClick={(option) => router.push(createUrl(option.value), { scroll: false })}
            />
        )
    }

    return (
        <DropDownFilter
            align='end'
            filter={sortValue}
            options={USER_PAGE_SORT.comments}
            onClick={(option) => router.push(createUrl(option.value), { scroll: false })}
        />
    )
}
