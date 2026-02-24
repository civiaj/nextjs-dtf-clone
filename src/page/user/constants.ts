import { PATH } from '@/shared/constants'
import { TUser } from '@/shared/types/user.types'
import { DropDownOption } from '@/shared/ui/dropdown-menu'
import { TLinksBarItem } from '@/shared/ui/LinksBar'
import { UserCommentsSort } from '@/shared/validation/comment.schema'
import { UserPostsSort } from '@/shared/validation/post.schema'
import { TUserPageSortMap } from './types'

export const USER_POSTS_SORT_OPTIONS: DropDownOption<UserPostsSort>[] = [
    { label: 'Свежее', value: 'new' },
    { label: 'Популярное', value: 'hotness' },
    { label: 'Топ за месяц', value: 'month' },
    { label: 'Топ за год', value: 'year' },
    { label: 'Топ за все время', value: 'all' }
]

export const USER_COMMENTS_SORT_OPTIONS: DropDownOption<UserCommentsSort>[] = [
    { label: 'Свежее', value: 'new' },
    { label: 'Популярное', value: 'hotness' },
    { label: 'Топ за месяц', value: 'month' },
    { label: 'Топ за год', value: 'year' },
    { label: 'Топ за все время', value: 'all' }
]

export const USER_PAGE_SORT: TUserPageSortMap = {
    posts: USER_POSTS_SORT_OPTIONS,
    comments: USER_COMMENTS_SORT_OPTIONS
}

export const createUserPageNavLinks = (id: TUser['id']): TLinksBarItem[] => {
    return [
        {
            href: `${PATH.USER}/${id}/posts`,
            label: 'Посты',
            isDefaultActive: true,
            match: 'startsWith'
        },
        {
            href: `${PATH.USER}/${id}/comments`,
            label: 'Комментарии',
            match: 'startsWith'
        }
    ]
}
