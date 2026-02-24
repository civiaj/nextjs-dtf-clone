import { useAppDispatch, useAppSelector } from '@/lib/store'
import { ContainerPadding } from '@/shared/ui/box'
import { DropDownFilter, DropDownOption } from '@/shared/ui/dropdown-menu'
import { Text } from '@/shared/ui/text'
import { getNoun } from '@/shared/utils/string.utils'
import { PostCommentsSort } from '@/shared/validation/comment.schema'
import { POST_COMMENTS_SORT_OPTIONS } from '../constants'
import { commentsTreeActions } from '../model/slice'

export const CommentsTreeHeader = ({ commentCount }: { commentCount: number }) => {
    const dispatch = useAppDispatch()
    const sortBy = useAppSelector((state) => state.commentsTree.sortBy)
    const headerTitle =
        commentCount === 0
            ? 'Начать дискуссию'
            : `${commentCount} ${getNoun(commentCount, 'Комментарий', 'Комментария', 'Комментариев')}`
    const handleClick = ({ value }: DropDownOption<PostCommentsSort>) => {
        dispatch(commentsTreeActions.setSortBy(value))
    }

    return (
        <ContainerPadding className='flex items-start justify-between'>
            <Text
                className='truncate'
                as='h3'>
                {headerTitle}
            </Text>
            <DropDownFilter
                align='end'
                options={POST_COMMENTS_SORT_OPTIONS}
                filter={sortBy}
                onClick={handleClick}
            />
        </ContainerPadding>
    )
}
