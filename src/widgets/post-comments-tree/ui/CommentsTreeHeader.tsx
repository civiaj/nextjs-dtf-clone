import { useAppDispatch, useAppSelector } from '@/lib/store'
import { ContainerPadding } from '@/shared/ui/box'
import { DropDownFilter } from '@/shared/ui/dropdown-menu'
import { Text } from '@/shared/ui/text'
import { getNoun } from '@/shared/utils/string.utils'
import { commentsTreeActions } from '@/widgets/post-comments-tree/model/slice'
import { POST_COMMENTS_SORT_OPTIONS } from '../constants'

export const CommentsTreeHeader = ({ commentCount }: { commentCount: number }) => {
    const dispatch = useAppDispatch()
    const sortBy = useAppSelector((state) => state.commentsTree.sortBy)
    const headerTitle =
        commentCount === 0
            ? 'Начать дискуссию'
            : `${commentCount} ${getNoun(commentCount, 'Комментарий', 'Комментария', 'Комментариев')}`

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
                onClick={({ value }) => dispatch(commentsTreeActions.setSortBy(value))}
            />
        </ContainerPadding>
    )
}
