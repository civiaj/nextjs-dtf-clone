'use client'

import { useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAppSelector } from '@/lib/store'
import { PATH } from '@/shared/constants'

export const useAuthGuard = () => {
    const { currentUser, staleUser, isRefreshAttempted } = useAppSelector((state) => state.auth)
    const router = useRouter()
    const searchParams = useSearchParams()
    const isWaitingForRefresh = Boolean(staleUser) && !isRefreshAttempted

    const promptLoginIfUnauthorized = useCallback(() => {
        if (!currentUser) {
            const params = new URLSearchParams(searchParams.toString())
            params.set('modal', 'auth')
            router.push(`?${params.toString()}`, { scroll: false })
            return true
        }

        return false
    }, [currentUser, router, searchParams])

    const navigateToLogin = useCallback(() => {
        router.push(`${PATH.MAIN_POPULAR}?modal=auth`, { scroll: false })
    }, [router])

    return {
        currentUser,
        staleUser,
        isRefreshAttempted,
        isWaitingForRefresh,
        promptLoginIfUnauthorized,
        navigateToLogin
    }
}
