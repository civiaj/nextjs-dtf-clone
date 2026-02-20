'use client'

import { NavigationGuardProvider } from 'next-navigation-guard'
import { ThemeProvider } from '@/entities/ui'
import { StoreProvider } from '@/lib/store'

export const Providers = ({ children }: { children: React.ReactNode }) => {
    return (
        <NavigationGuardProvider>
            <StoreProvider>
                <ThemeProvider>{children}</ThemeProvider>
            </StoreProvider>
        </NavigationGuardProvider>
    )
}
