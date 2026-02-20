import { useMemo } from 'react'
import { useAppSelector } from '@/lib/store'
import { TComment } from '@/shared/types/comment.types'
import { Button } from '@/shared/ui/button'
import { getNoun } from '@/shared/utils/string.utils'
import { LoadMoreCommentsButton } from './LoadMoreCommentsButton'
import { makeSelectHasReplies } from '../model/selectors'

type Props = { id: TComment['id']; replyCount: number; areExpanded: boolean }

export const CommentTreeExpandRepliesButton = (props: Props) => {
    if (props.replyCount <= 0) return null
    return <CommentTreeExpandRepliesComponent {...props} />
}

const CommentTreeExpandRepliesComponent = ({ areExpanded, id, replyCount }: Props) => {
    const selectHasReplies = useMemo(makeSelectHasReplies, [])
    const hasReplies = useAppSelector((state) => selectHasReplies(state, id))

    const buttonTitle = areExpanded
        ? 'Свернуть'
        : `${replyCount} ${getNoun(replyCount, 'ответ', 'ответа', 'ответов')}`

    if (hasReplies) {
        return (
            <Button
                data-action='expand'
                data-comment-id={id}
                size={'md'}
                padding={'tight'}
                variant={'clean-active'}>
                {buttonTitle}
            </Button>
        )
    }
    return (
        <LoadMoreCommentsButton
            title={buttonTitle}
            parentId={id}
        />
    )
}

// Reset adapter if prev route is not /comment
