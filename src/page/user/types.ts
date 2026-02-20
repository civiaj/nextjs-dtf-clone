import { TUserPageSection } from '@/shared/types/comment.types'
import { TDropDownOption } from '@/shared/ui/dropdown-menu'
import { UserCommentsSort } from '@/shared/validation/comment.schema'
import { UserPostsSort } from '@/shared/validation/post.schema'

export type TUserPageSortMap = {
    posts: TDropDownOption<UserPostsSort>[]
    comments: TDropDownOption<UserCommentsSort>[]
}

export type TUserPageSortValueMap = {
    posts: UserPostsSort
    comments: UserCommentsSort
}

export type TUserPageSortValue = TUserPageSortValueMap[TUserPageSection]
