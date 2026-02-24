import { DropDownOption } from '@/shared/ui/dropdown-menu'
import {
    PostMainFeedSort,
    PostOwnerContentSort,
    PostRecentContentSort
} from '@/shared/validation/post.schema'
import { TMainPageSortMap } from '../types'

const POST_OWNER_CONTENT_SORT: DropDownOption<PostOwnerContentSort>[] = [
    { label: 'По дате', value: 'new' },
    { label: 'По популярности', value: 'popular' }
]

const POST_RECENT_SORT: DropDownOption<PostRecentContentSort>[] = [
    { label: 'Новое', value: 'latest' },
    { label: '+5 часов', value: 'latest-5' },
    { label: '+10 часов', value: 'latest-10' }
]

const POST_FEED_SORT: DropDownOption<PostMainFeedSort>[] = [
    {
        label: new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' }),
        value: 'hotness'
    },
    { label: '24 часа', value: 'day' },
    { label: 'Неделя', value: 'week' },
    { label: 'Месяц', value: 'month' },
    { label: 'Год', value: 'year' },
    { label: 'Все время', value: 'all' }
]

export const MAIN_PAGE_SORT: TMainPageSortMap = {
    popular: POST_FEED_SORT,
    new: POST_RECENT_SORT,
    my: POST_OWNER_CONTENT_SORT
}
