'use client'

import { LoginButton } from '@/features/auth-login'
import { useAppSelector } from '@/lib/store'
import { NavigationBarDropdown } from './NavigationBarDropdown'

export const NavigaitonMenu = () => {
    const staleUser = useAppSelector((state) => state.auth.staleUser)
    if (!staleUser) return <LoginButton />
    return <NavigationBarDropdown />
}
