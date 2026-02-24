'use client'

import Link from 'next/link'
import { ChangeThemeDropdownItem } from '@/entities/ui'
import { LogoutDropdownItem } from '@/features/auth-logout'
import { useAppSelector } from '@/lib/store'
import { PATH } from '@/shared/constants'
import { ChevronDownAppIcon, SettingsAppIcon, SquarePenAppIcon } from '@/shared/icons'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/shared/ui/dropdown-menu'
import { Text } from '@/shared/ui/text'
import { UserAvatar } from '@/shared/ui/user-avatar'

export const NavigationBarDropdown = () => {
    const staleUser = useAppSelector((state) => state.auth.staleUser)

    if (!staleUser) return null

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger className='flex items-center gap-1 rounded-full'>
                <UserAvatar.Avatar
                    avatar={staleUser.avatar}
                    name={staleUser.name}
                    avatarColor={staleUser.avatarColor}
                />
                <ChevronDownAppIcon
                    size={16}
                    className='hidden sm:block'
                />
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align='end'
                className='min-w-52 max-w-64 md:min-w-60 md:max-w-72'>
                <DropdownMenuItem asChild>
                    <Link href={`${PATH.USER}/${staleUser.id}`}>
                        <UserAvatar>
                            <UserAvatar.Avatar
                                avatar={staleUser.avatar}
                                name={staleUser.name}
                                avatarColor={staleUser.avatarColor}
                            />
                            <UserAvatar.Details>
                                <UserAvatar.Name name={staleUser.name} />
                                <UserAvatar.Extra description={'@id' + staleUser.id} />
                            </UserAvatar.Details>
                        </UserAvatar>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href={PATH.DRAFT}>
                        <SquarePenAppIcon />
                        <Text as='p'>Черновики</Text>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href={PATH.SETTINGS}>
                        <SettingsAppIcon />
                        <Text as='p'>Настройки</Text>
                    </Link>
                </DropdownMenuItem>
                <ChangeThemeDropdownItem />
                <DropdownMenuSeparator />
                <LogoutDropdownItem />
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
