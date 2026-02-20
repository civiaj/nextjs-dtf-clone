'use client'

import { useIsOwner } from '@/entities/auth'
import { TUser } from '@/shared/types/user.types'
import { Button, ButtonProps } from '@/shared/ui/button'
import { useUserFollowUpdate } from '../hooks/useUserFollowUpdate'

export const FollowUserButton = ({
    id,
    isActive,
    title = 'Подписаться',
    ...buttonProps
}: {
    id: TUser['id']
    isActive: boolean
    title?: string
} & Omit<ButtonProps, 'id'>) => {
    const { isOwner } = useIsOwner(id)
    const { execute, isLoading } = useUserFollowUpdate()
    const handleFollow = () => execute({ id, action: 'create' })

    if (isOwner || isActive) return null

    return (
        <Button
            {...buttonProps}
            onClick={handleFollow}
            disabled={isLoading}>
            {title}
        </Button>
    )
}
