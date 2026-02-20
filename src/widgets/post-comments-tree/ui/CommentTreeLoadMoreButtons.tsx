import { useMemo } from 'react'
import { useAppSelector } from '@/lib/store'
import { TComment } from '@/shared/types/comment.types'
import { getNoun } from '@/shared/utils/string.utils'
import { CommentTreeBranch } from './CommentTreeBranch'
import { LoadMoreCommentsButton } from './LoadMoreCommentsButton'
import { makeSelectLoadMoreReplyButtons } from '../model/selectors'

export const CommentTreeLoadMoreButtons = ({ id }: { id: TComment['id'] }) => {
    const selectLoadMoreReplyButtons = useMemo(makeSelectLoadMoreReplyButtons, [])
    const buttons = useAppSelector((state) => selectLoadMoreReplyButtons(state, id))

    return buttons.map(({ id, count, parentId, cursor }) => {
        if (!count) return null
        return (
            <div
                key={id}
                className='flex'>
                <CommentTreeBranch
                    id={id}
                    isLoadMore
                />
                <LoadMoreCommentsButton
                    className='pt-3 sm:pt-6'
                    parentId={parentId}
                    cursor={cursor}
                    title={`Еще ${count} ${getNoun(count, 'ответ', 'ответа', 'ответов')}`}
                />
            </div>
        )
    })
}
