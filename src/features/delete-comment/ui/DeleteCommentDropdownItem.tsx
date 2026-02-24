import { useState } from 'react'
import { useIsOwner } from '@/entities/auth'
import { TrashAppIcon } from '@/shared/icons'
import { TComment } from '@/shared/types/comment.types'
import { TUser } from '@/shared/types/user.types'
import { DropdownMenuItem } from '@/shared/ui/dropdown-menu'
import { useDeleteComment } from '../hooks'

export const DeleteCommentDropdownItem = ({
    userId,
    id,
    isDeleted
}: {
    userId: TUser['id']
    id: TComment['id']
    isDeleted: boolean
}) => {
    const { isOwner } = useIsOwner(userId)
    const { onDeleteComment } = useDeleteComment(id)
    const [isConfirmed, setIsConfirmed] = useState(false)

    if (!isOwner || isDeleted) return null

    if (!isConfirmed) {
        return (
            <DropdownMenuItem
                onSelect={(e) => {
                    e.preventDefault()
                    setIsConfirmed(true)
                }}>
                <TrashAppIcon />
                Удалить комментарий
            </DropdownMenuItem>
        )
    }

    return (
        <DropdownMenuItem
            variant='destructive'
            onClick={onDeleteComment}>
            <TrashAppIcon />
            Точно удалить?
        </DropdownMenuItem>
    )
}
