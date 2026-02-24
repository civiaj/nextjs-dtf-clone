import { useRouter } from 'next/navigation'
import { PATH } from '@/shared/constants'
import { DropDownFilter, DropDownOption } from '@/shared/ui/dropdown-menu'
import { UserCommentsSort } from '@/shared/validation/comment.schema'
import { UserPostsSort } from '@/shared/validation/post.schema'
import { USER_PAGE_SORT } from '../constants'
import { useUserPageRoute } from '../model/hooks/useUserPageRoute'

export const UserPageSortDropdown = () => {
    const { sectionValue, sortValue, idValue } = useUserPageRoute()
    const router = useRouter()

    const handleClick = ({ value }: DropDownOption<UserPostsSort | UserCommentsSort>) => {
        router.push(`${PATH.USER}/${idValue}/${sectionValue}/${value}`, { scroll: false })
    }

    if (sectionValue === 'posts') {
        return (
            <DropDownFilter
                align='end'
                filter={sortValue}
                options={USER_PAGE_SORT.posts}
                onClick={handleClick}
            />
        )
    }

    return (
        <DropDownFilter
            align='end'
            filter={sortValue}
            options={USER_PAGE_SORT.comments}
            onClick={handleClick}
        />
    )
}
