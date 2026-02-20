import { useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '@/lib/store'
import { TComment } from '@/shared/types/comment.types'
import { ContainerPadding } from '@/shared/ui/box'
import { Button } from '@/shared/ui/button'
import { CommentTreeBranch } from './CommentTreeBranch'
import { CommentTreeEditor } from './CommentTreeEditor'
import { CommentTreeExpandRepliesButton } from './CommentTreeExpandRepliesButton'
import { makeSelectAreRepliesExpanded, makeSelectIsReplyTarget } from '../model/selectors'
import { commentsTreeActions } from '../model/slice'

type Props = Pick<TComment, 'id' | 'replyCount'>

export const CommentTreeFooter = ({ id, replyCount }: Props) => {
    const dispatch = useAppDispatch()
    const postId = useAppSelector((state) => state.commentsTree.postId)!
    const selectAreExpanded = useMemo(makeSelectAreRepliesExpanded, [])
    const selectIsReplyTarget = useMemo(makeSelectIsReplyTarget, [])
    const isReplyTarget = useAppSelector((state) => selectIsReplyTarget(state, id))
    const areExpanded = useAppSelector((state) => selectAreExpanded(state, id))

    const handleSuccess = (comment: TComment) => {
        dispatch(commentsTreeActions.addLocalComment(comment))
        dispatch(commentsTreeActions.toggleReplyTarget({ id }))
    }

    const handleCancel = () => {
        dispatch(commentsTreeActions.toggleReplyTarget({ id }))
    }

    return (
        <>
            <div className='mt-2 flex gap-2'>
                <Button
                    data-action='reply'
                    data-comment-id={id}
                    size={'md'}
                    padding={'tight'}
                    variant={'clean'}>
                    {isReplyTarget ? 'Отменить' : 'Ответить'}
                </Button>
                <CommentTreeExpandRepliesButton
                    id={id}
                    replyCount={replyCount}
                    areExpanded={areExpanded}
                />
            </div>
            {isReplyTarget && (
                <div className='flex'>
                    <CommentTreeBranch
                        id={id}
                        isEditorHistory
                    />
                    <ContainerPadding className='flex flex-1 break-all px-0 pb-2 md:px-0'>
                        <CommentTreeEditor
                            postId={postId}
                            parentId={id}
                            onCancel={handleCancel}
                            onSuccess={handleSuccess}
                        />
                    </ContainerPadding>
                </div>
            )}
        </>
    )
}
