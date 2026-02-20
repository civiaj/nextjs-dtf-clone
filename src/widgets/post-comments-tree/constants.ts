import { TDropDownOption } from '@/shared/ui/dropdown-menu'
import { PostCommentsSort } from '@/shared/validation/comment.schema'

export const POST_COMMENTS_SORT_OPTIONS: TDropDownOption<PostCommentsSort>[] = [
    { label: 'Популярное', value: 'hotness' },
    { label: 'Свежее', value: 'new' }
]
