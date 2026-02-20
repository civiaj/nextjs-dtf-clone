'use client'

import { useAppDispatch } from '@/lib/store'
import { TComment } from '@/shared/types/comment.types'
import { TPost } from '@/shared/types/post.types'
import { ContainerPadding, MessageContainer } from '@/shared/ui/box'
// import { CommentsListSkeleton } from '@/widgets/comment/comment-item'
import { BackToAllCommentsButton } from './BackToAllCommentsButton'
import { CommentsTreeActionsWrapper } from './CommentsTreeActionsWrapper'
import { CommentsTreeHeader } from './CommentsTreeHeader'
import { CommentsTreeList } from './CommentsTreeList'
import { CommentTreeEditor } from './CommentTreeEditor'
import { LoadMoreRootCommentsButton } from './LoadMoreRootCommentsButton'
import { Skeleton } from './Skeleton'
import { useGetPostComments } from '../model/hooks/useGetPostComments'
import { useThreadQueryParam } from '../model/hooks/useThreadQueryParam'
import { commentsTreeActions } from '../model/slice'

type Props = { postId: TPost['id']; fallbackCommentCount: number }

export const CommentsTree = ({ fallbackCommentCount, postId }: Props) => {
    const threadId = useThreadQueryParam()
    const dispatch = useAppDispatch()
    const { isMutedByUser, isSkeletonVisible, isError, commentCount } = useGetPostComments({
        postId,
        fallbackCommentCount
    })

    if (isError) {
        console.warn('Не удалось загрузить комментарии.')
        return null
    }

    if (isMutedByUser) {
        return (
            <MessageContainer>Вы не можете оставлять комментарии под этой записью</MessageContainer>
        )
    }

    const children = isSkeletonVisible ? (
        <Skeleton />
    ) : (
        <>
            {threadId && <BackToAllCommentsButton commentCount={commentCount} />}
            <CommentsTreeList threadId={threadId} />
            {threadId && <BackToAllCommentsButton commentCount={commentCount} />}
            {!threadId && <LoadMoreRootCommentsButton commentCount={commentCount} />}
        </>
    )

    const handleSuccess = (comment: TComment) => {
        dispatch(commentsTreeActions.addLocalComment(comment))
    }

    return (
        <CommentsTreeActionsWrapper>
            {threadId ? (
                children
            ) : (
                <>
                    <CommentsTreeHeader commentCount={commentCount} />
                    <ContainerPadding>
                        <CommentTreeEditor
                            postId={postId}
                            onSuccess={handleSuccess}
                        />
                    </ContainerPadding>
                    {children}
                </>
            )}
        </CommentsTreeActionsWrapper>
    )
}
