'use client'

import { DropdownMenuItem } from '@radix-ui/react-dropdown-menu'
import { useLogoutMutation } from '@/entities/auth'
import { LogOutAppIcon } from '@/shared/icons'
import { Button } from '@/shared/ui/button'

export const LogoutDropdownItem = () => {
    const [logout, { isLoading }] = useLogoutMutation()
    const handleLogout = () => logout()

    return (
        <DropdownMenuItem asChild>
            <Button
                className='focus-visible: w-full focus:bg-accent focus-visible:ring-0'
                variant={'ghost'}
                onClick={handleLogout}
                disabled={isLoading}>
                <LogOutAppIcon />
                Выйти
            </Button>
        </DropdownMenuItem>
    )
}
