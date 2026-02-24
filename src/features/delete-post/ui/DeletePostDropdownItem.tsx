import { useState } from 'react'
import { useIsOwner } from '@/entities/auth'
import { useDeletePostMutation } from '@/entities/post'
import { formatErrorMessage } from '@/lib/error'
import { TrashAppIcon } from '@/shared/icons'
import { TPost } from '@/shared/types/post.types'
import { TUser } from '@/shared/types/user.types'
import { DropdownMenuItem } from '@/shared/ui/dropdown-menu'
import { showToast } from '@/shared/ui/toaster'
import { DeletePostModal } from './DeletePostModal'

type Props = {
    postId: TPost['id']
    userId: TUser['id']
    onClose: () => void
    title?: string
}

export const DeletePostDropdownItemWithModal = ({ postId, userId, onClose, title }: Props) => {
    const { isOwner } = useIsOwner(userId)
    const [isModal, setIsModal] = useState(false)

    if (!isOwner) return null

    return (
        <>
            <DropdownMenuItem
                onClick={() => setIsModal(true)}
                onSelect={(e) => e.preventDefault()}>
                <TrashAppIcon size={20} />
                Удалить
            </DropdownMenuItem>
            <DeletePostModal
                title={title}
                isOpen={isModal}
                onCloseModal={onClose}
                postId={postId}
            />
        </>
    )
}

export const DeletePostDropdownItem = ({ postId, userId, onClose, title }: Props) => {
    const { isOwner } = useIsOwner(userId)
    const [isConfirmed, setIsConfirmed] = useState(false)
    const [deletePost, { isLoading }] = useDeletePostMutation()

    const handleClick = () => {
        deletePost(postId)
            .unwrap()
            .then(() => {
                onClose()
            })
            .catch((err) => {
                showToast('warning', { description: formatErrorMessage(err) })
            })
    }

    if (!isOwner) return null

    if (!isConfirmed)
        return (
            <DropdownMenuItem
                onClick={() => setIsConfirmed(true)}
                onSelect={(e) => e.preventDefault()}>
                <TrashAppIcon size={20} />
                Удалить
            </DropdownMenuItem>
        )

    return (
        <DropdownMenuItem
            disabled={isLoading}
            onClick={handleClick}
            variant='destructive'>
            <TrashAppIcon size={20} />
            {title ?? 'Точно удалить?'}
        </DropdownMenuItem>
    )
}
