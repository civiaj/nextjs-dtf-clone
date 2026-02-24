'use client'

import { useIsOwner } from '@/entities/auth'
import { UserUnsubscribeAppIcon } from '@/shared/icons'
import { TUser } from '@/shared/types/user.types'
import { DropdownMenuItem } from '@/shared/ui/dropdown-menu'
import { useUserFollowUpdate } from '../hooks/useUserFollowUpdate'

export const UnfollowUserDropdownItem = ({
    id,
    isActive,
    title = 'Отписаться'
}: {
    id: TUser['id']
    isActive: boolean
    title?: string
}) => {
    const { isOwner } = useIsOwner(id)
    const { execute, isLoading } = useUserFollowUpdate()
    const handleUnfollow = () => execute({ id, action: 'remove' })

    if (isOwner || !isActive) return null

    return (
        <DropdownMenuItem
            disabled={isLoading}
            className='flex items-center gap-3'
            onClick={handleUnfollow}>
            <UserUnsubscribeAppIcon />
            {title}
        </DropdownMenuItem>
    )
}
