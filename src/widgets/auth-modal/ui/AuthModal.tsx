'use client'

import { AuthModalSceen } from './AuthModalScreen'
import { useAuthModalParams } from '../model/hooks/useAuthModalParams'

export const AuthModal = () => {
    const { isAuthModal, isLoginScreen, isSignupScreen } = useAuthModalParams()

    if (!isAuthModal) return null

    return (
        <AuthModalSceen
            isLoginScreen={isLoginScreen}
            isSignupScreen={isSignupScreen}
        />
    )
}
