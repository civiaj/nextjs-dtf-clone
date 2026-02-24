'use client'

import { memo, ReactNode, useMemo } from 'react'
import Link from 'next/link'
import { makeSelectUser } from '@/entities/user'
import { useAppSelector } from '@/lib/store'
import { PATH } from '@/shared/constants'
import { TUser } from '@/shared/types/user.types'
import { Container, ContainerPadding } from '@/shared/ui/box'
import { UserAvatar } from '@/shared/ui/user-avatar'
import { cn } from '@/shared/utils/common.utils'

type UserListItemBaseProps = {
    id: TUser['id']
    action?: ReactNode | ((user: TUser) => ReactNode)
}

type UserListItemContentProps = {
    user: TUser
    action?: ReactNode | ((user: TUser) => ReactNode)
    isCompact?: boolean
    withHover?: boolean
}

const UserListItemContent = ({
    user,
    action,
    isCompact = false,
    withHover = false
}: UserListItemContentProps) => {
    const userHref = `${PATH.USER}/${user.id}`
    const actionElement = typeof action === 'function' ? action(user) : action
    const handleActionContainerClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
        e.preventDefault()
        e.stopPropagation()
    }

    return (
        <Link
            href={userHref}
            className={cn('block', { ['hover:bg-muted']: withHover })}>
            <ContainerPadding
                className={cn({
                    ['py-2 sm:py-3']: isCompact
                })}>
                <div className='flex items-center justify-between gap-3'>
                    <div className='min-w-0'>
                        <UserAvatar className='mr-0 flex items-center gap-3'>
                            <UserAvatar.Avatar
                                avatar={user.avatar}
                                avatarColor={user.avatarColor}
                                name={user.name}
                            />
                            <UserAvatar.Details>
                                <UserAvatar.Name name={user.name} />
                                <UserAvatar.Extra
                                    description={user.description ?? `@id${user.id}`}
                                />
                            </UserAvatar.Details>
                        </UserAvatar>
                    </div>
                    {Boolean(actionElement) && (
                        <div onClick={handleActionContainerClick}>{actionElement}</div>
                    )}
                </div>
            </ContainerPadding>
        </Link>
    )
}

export const UserListItem = memo(({ id, action }: UserListItemBaseProps) => {
    const selectUser = useMemo(makeSelectUser, [])
    const user = useAppSelector((state) => selectUser(state, id))

    if (!user) return null

    return (
        <div className='relative w-full overflow-hidden'>
            <UserListItemContent
                user={user}
                action={action}
                withHover
                isCompact
            />
        </div>
    )
})

export const UserListItemInContainer = memo(({ id, action }: UserListItemBaseProps) => {
    const selectUser = useMemo(makeSelectUser, [])
    const user = useAppSelector((state) => selectUser(state, id))

    if (!user) return null

    return (
        <Container className='relative w-full overflow-hidden'>
            <UserListItemContent
                user={user}
                action={action}
            />
        </Container>
    )
})

UserListItem.displayName = 'UserListItem'
UserListItemInContainer.displayName = 'UserListItemInContainer'

export type { UserListItemBaseProps as UserListItemProps }
