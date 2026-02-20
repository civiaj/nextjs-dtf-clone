'use client'

import { TComment } from '@/shared/types/comment.types'
import { TUser } from '@/shared/types/user.types'
import { CommentItemBodyDeleted } from './CommentItemBodyDeleted'
import { CommentItemBodyMuted } from './CommentItemBodyMuted'
import { CommentItemDropdownProps } from './CommentItemDropdown'
import { CommentItemHeader } from './CommentItemHeader'

type CommentItemProps = {
    comment: Pick<TComment, 'id' | 'createdAt' | 'isDeleted'>
    user: Pick<TUser, 'id' | 'name' | 'avatar' | 'avatarColor'>
    showMutedBody?: boolean
    body?: React.ReactNode
    footer?: React.ReactNode
    headerExtra?: React.ReactNode
    dropdownActions: CommentItemDropdownProps['actions']
    onShowMutedComment?: () => void
    deletedBody?: React.ReactNode
    mutedBody?: React.ReactNode
    className?: string
}

export const CommentItem = ({
    comment,
    user,
    showMutedBody = false,
    body,
    footer,
    headerExtra,
    dropdownActions,
    onShowMutedComment,
    deletedBody,
    mutedBody,
    className
}: CommentItemProps) => {
    if (comment.isDeleted) {
        return <div className={className}>{deletedBody ?? <CommentItemBodyDeleted />}</div>
    }

    if (showMutedBody) {
        return (
            <div className={className}>
                {mutedBody ?? <CommentItemBodyMuted onShow={onShowMutedComment} />}
                {footer}
            </div>
        )
    }

    return (
        <div className={className}>
            <CommentItemHeader
                user={user}
                createdAt={comment.createdAt}
                extra={headerExtra}
                dropdownActions={dropdownActions}
            />
            {body}
            {footer}
        </div>
    )
}
