import { TUserPageSection } from '@/shared/types/comment.types'
import { DropDownOption } from '@/shared/ui/dropdown-menu'
import { UserCommentsSort } from '@/shared/validation/comment.schema'
import { UserPostsSort } from '@/shared/validation/post.schema'

export type TUserPageSortMap = {
    posts: DropDownOption<UserPostsSort>[]
    comments: DropDownOption<UserCommentsSort>[]
}

export type TUserPageSortValueMap = {
    posts: UserPostsSort
    comments: UserCommentsSort
}

export type TUserPageSortValue = TUserPageSortValueMap[TUserPageSection]
