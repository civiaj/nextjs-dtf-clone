'use client'

import React, { useEffect, useRef } from 'react'
import { Container } from '@/shared/ui/box'
import { LoadingDots } from '@/shared/ui/loading-indicator'
import { useAuthGuard } from '../model/hooks/useAuthGuard'

export const AuthGuard = ({
    children,
    Skeleton
}: {
    children: React.ReactNode
    Skeleton?: React.JSX.Element
}) => {
    const { currentUser, isWaitingForRefresh, navigateToLogin } = useAuthGuard()
    const hasRedirectedRef = useRef(false)

    useEffect(() => {
        if (currentUser || isWaitingForRefresh || hasRedirectedRef.current) return

        hasRedirectedRef.current = true
        navigateToLogin()
    }, [currentUser, isWaitingForRefresh, navigateToLogin])

    if (!currentUser)
        return (
            Skeleton ?? (
                <Container
                    withBottom={false}
                    className='flex min-h-44 items-center justify-center'>
                    <LoadingDots />
                </Container>
            )
        )

    return children
}
