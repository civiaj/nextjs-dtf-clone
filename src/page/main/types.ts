import { DropDownOption } from '@/shared/ui/dropdown-menu'
import {
    PostMainFeedSort,
    PostOwnerContentSort,
    PostRecentContentSort
} from '@/shared/validation/post.schema'

export type TMainPageSortMap = {
    popular: DropDownOption<PostMainFeedSort>[]
    new: DropDownOption<PostRecentContentSort>[]
    my: DropDownOption<PostOwnerContentSort>[]
}

export type TMainPageSortAll = PostMainFeedSort | PostRecentContentSort | PostOwnerContentSort
