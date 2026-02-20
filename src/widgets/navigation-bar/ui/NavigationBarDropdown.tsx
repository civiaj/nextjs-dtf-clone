'use client'

import { useRouter } from 'next/navigation'
import { LogoutButton } from '@/features/auth-logout'
import { useAppSelector } from '@/lib/store'
import { PATH } from '@/shared/constants'
import { ChevronDownAppIcon, SettingsAppIcon, SquarePenAppIcon } from '@/shared/icons'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/shared/ui/dropdown-menu'
import { Text } from '@/shared/ui/text'
import { UserAvatar } from '@/shared/ui/user-avatar'

export const NavigationBarDropdown = () => {
    const staleUser = useAppSelector((state) => state.auth.staleUser)
    const router = useRouter()

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
                <DropdownMenuItem onSelect={() => router.push(`${PATH.USER}/${staleUser.id}`)}>
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
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => router.push(PATH.DRAFT)}>
                    <SquarePenAppIcon size={20} />
                    <Text as='p'>Черновики</Text>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => router.push(PATH.SETTINGS)}>
                    <SettingsAppIcon size={20} />
                    <Text as='p'>Настройки</Text>
                </DropdownMenuItem>
                <div className='border border-border' />
                <LogoutButton />
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
