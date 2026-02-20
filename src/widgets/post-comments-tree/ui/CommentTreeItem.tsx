import { memo, useCallback, useMemo } from 'react'
import { COMMENT_THREAD_QUERY_PARAM, CommentItem, makeSelectComment } from '@/entities/comment'
import { makeSelectUser } from '@/entities/user'
import { UpdateBookmarkDropdownItem } from '@/features/bookmark'
import { commentEditorExtensions } from '@/features/comment-editor'
import { CopyUrlDropdownItem } from '@/features/copy-url-dropdown-item'
import { DeleteCommentDropdownItem } from '@/features/delete-comment'
import { ReactionBar } from '@/features/facades/reaction-entity'
import { MuteUserDropdownItem } from '@/features/mute'
import { useAppDispatch, useAppSelector } from '@/lib/store'
import { PATH } from '@/shared/constants'
import { CommentView } from '@/shared/services/tiptap'
import { TComment } from '@/shared/types/comment.types'
import { CommentTreeFooter } from './CommentTreeFooter'
import { HighlightParentCommentButton } from './HighlightParentCommentButton'
import { makeSelectUiUserMuted } from '../model/selectors'
import { commentsTreeActions } from '../model/slice'

export const CommentTreeItem = memo(({ id }: { id: TComment['id'] }) => {
    const selectComment = useMemo(makeSelectComment, [])
    const selectUser = useMemo(makeSelectUser, [])
    const selectUiUserMuted = useMemo(makeSelectUiUserMuted, [])

    const dispatch = useAppDispatch()

    const comment = useAppSelector((state) => selectComment(state, id))
    const user = useAppSelector((state) => selectUser(state, comment?.user.id))
    const userId = user?.id
    const isUiUserMuted = useAppSelector((state) => selectUiUserMuted(state, user?.id))

    const handleShowMutedComment = useCallback(() => {
        if (!userId) return
        dispatch(commentsTreeActions.setUserMute({ userId, value: false }))
    }, [dispatch, userId])

    if (!comment || !user) return null

    return (
        <CommentItem
            showMutedBody={isUiUserMuted}
            comment={comment}
            user={user}
            dropdownActions={() => (
                <>
                    <CopyUrlDropdownItem
                        url={`${process.env.NEXT_PUBLIC_APP_URL}${PATH.POST}/${comment.post.slug}?${COMMENT_THREAD_QUERY_PARAM}=${comment.id}`}
                    />
                    <UpdateBookmarkDropdownItem
                        id={comment.id}
                        isActive={comment.isBookmarked}
                        target='COMMENT'
                    />
                    <MuteUserDropdownItem
                        id={user.id}
                        isActive={user.isMuted}
                    />
                    <DeleteCommentDropdownItem
                        isDeleted={comment.isDeleted}
                        id={comment.id}
                        userId={user.id}
                    />
                </>
            )}
            className='group flex-1 pt-4'
            onShowMutedComment={handleShowMutedComment}
            headerExtra={<HighlightParentCommentButton parentId={comment.parentId} />}
            body={
                <CommentView
                    extensions={commentEditorExtensions}
                    json={comment.json}
                    media={comment.media}
                />
            }
            footer={
                <>
                    <ReactionBar
                        className='mt-2'
                        id={comment.id}
                        reactions={comment.reactions}
                        size='sm'
                        target='COMMENT'
                    />
                    <CommentTreeFooter
                        id={comment.id}
                        replyCount={comment.replyCount}
                    />
                </>
            }
        />
    )
})
CommentTreeItem.displayName = 'CommentTreeItem'
