import { TDropDownOption } from '@/shared/ui/dropdown-menu'
import {
    PostMainFeedSort,
    PostOwnerContentSort,
    PostRecentContentSort
} from '@/shared/validation/post.schema'

export type TMainPageSortMap = {
    popular: TDropDownOption<PostMainFeedSort>[]
    new: TDropDownOption<PostRecentContentSort>[]
    my: TDropDownOption<PostOwnerContentSort>[]
}

export type TMainPageSortAll = PostMainFeedSort | PostRecentContentSort | PostOwnerContentSort
