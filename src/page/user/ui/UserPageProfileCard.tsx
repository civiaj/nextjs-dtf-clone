'use client'

import { memo, useMemo } from 'react'
import Link from 'next/link'
import { useIsOwner } from '@/entities/auth'
import { FollowUserButton, UnfollowUserDropdownItem } from '@/features/follow-user'
import { MuteUserDropdownItem } from '@/features/mute'
import { UserProfileAvatar, UserProfileCover } from '@/features/update-owner'
import { useUserData } from '@/features/user-content'
import { PATH } from '@/shared/constants'
import { DotsAppIcon, SettingsAppIcon } from '@/shared/icons'
import { TUser } from '@/shared/types/user.types'
import { Container, ContainerPadding } from '@/shared/ui/box'
import { Button } from '@/shared/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/shared/ui/dropdown-menu'
import { LinksBar } from '@/shared/ui/LinksBar'
import { Text } from '@/shared/ui/text'
import { cn } from '@/shared/utils/common.utils'
import { getFromDate } from '@/shared/utils/date.utils'
import { getNoun } from '@/shared/utils/string.utils'
import { UsersListModalTrigger } from '@/widgets/users-list'
import { createUserPageNavLinks } from '../constants'
import { UserPageSkeleton } from './UserPageSkeleton'
import { UserPageSortDropdown } from './UserPageSortDropdown'

export const UserPageProfileCard = ({ serverData }: { serverData: TUser }) => {
    const { user, isClientData } = useUserData(serverData.id, { serverData })
    const { isOwner } = useIsOwner(serverData.id)

    if (isOwner && !isClientData) return <UserPageSkeleton />

    return <UserPageProfileCardContent user={user} />
}

const UserPageProfileCardContent = memo(({ user }: { user: TUser }) => {
    const { isOwner } = useIsOwner(user.id)
    const items = useMemo(() => createUserPageNavLinks(user.id), [user.id])

    return (
        <>
            <Container
                className='relative overflow-hidden'
                withBottom={false}>
                <UserProfileCover
                    isOwner={isOwner}
                    cover={user.cover}
                    coverY={user.coverY}
                    id={user.id}
                />
                <ContainerPadding className='-mt-10 flex items-end justify-between gap-2 pt-0 sm:-mt-20'>
                    <UserProfileAvatar
                        name={user.name}
                        avatar={user.avatar}
                        avatarColor={user.avatarColor}
                        isOwner={isOwner}
                    />
                    {isOwner ? (
                        <Link href={PATH.SETTINGS}>
                            <Button
                                tabIndex={-1}
                                variant={'outline'}
                                size={'icon-base'}>
                                <SettingsAppIcon />
                            </Button>
                        </Link>
                    ) : (
                        <div className='flex gap-3'>
                            <FollowUserButton
                                id={user.id}
                                variant={'blue'}
                                isActive={user.isFollowed}
                            />
                            <DropdownMenu modal={false}>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant={'outline'}
                                        size={'icon-base'}>
                                        <DotsAppIcon />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align='end'>
                                    <UnfollowUserDropdownItem
                                        id={user.id}
                                        isActive={user.isFollowed}
                                    />
                                    <MuteUserDropdownItem
                                        id={user.id}
                                        isActive={user.isMuted}
                                    />
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    )}
                </ContainerPadding>
                <ContainerPadding className='overflow-hidden break-words'>
                    <Text
                        className='truncate'
                        as='h2'>
                        {user.name}
                    </Text>

                    <Text
                        as='p'
                        className='truncate text-xs text-muted-foreground md:text-sm'>
                        {getFromDate(user.createdAt)}
                    </Text>
                    {user.description && <Text className='mt-4'>{user.description}</Text>}

                    <div className='mt-4 flex gap-3 truncate font-medium'>
                        <UsersListModalTrigger
                            type='user-followers'
                            title='Подписчики'
                            userId={user.id}
                            trigger={({ open }) => (
                                <Button
                                    className={cn('px-0', {
                                        ['pointer-events-none']: user.followersCount === 0
                                    })}
                                    onClick={open}
                                    variant={'clean'}
                                    size={'md'}>
                                    <span>
                                        <span className='font-bold text-active'>
                                            {user.followersCount}
                                        </span>{' '}
                                        {getNoun(
                                            user.followersCount,
                                            'подписчик',
                                            'подписчика',
                                            'подписчиков'
                                        )}
                                    </span>
                                </Button>
                            )}
                        />
                        <UsersListModalTrigger
                            type='user-subscriptions'
                            title='Подписки'
                            userId={user.id}
                            trigger={({ open }) => (
                                <Button
                                    className={cn('px-0', {
                                        ['pointer-events-none']: user.subscriptionsCount === 0
                                    })}
                                    onClick={open}
                                    variant={'clean'}
                                    size={'md'}>
                                    <span>
                                        <span className='font-bold text-active'>
                                            {user.subscriptionsCount}
                                        </span>{' '}
                                        {getNoun(
                                            user.subscriptionsCount,
                                            'подписка',
                                            'подписки',
                                            'подписок'
                                        )}
                                    </span>
                                </Button>
                            )}
                        />
                    </div>
                </ContainerPadding>
                <ContainerPadding
                    withTop={false}
                    className='flex items-center justify-between gap-4'>
                    <LinksBar
                        items={items}
                        linkItemClassName='py-4'
                    />
                    <UserPageSortDropdown />
                </ContainerPadding>
            </Container>
        </>
    )
})

UserPageProfileCardContent.displayName = 'UserPageProfileCardContent'
