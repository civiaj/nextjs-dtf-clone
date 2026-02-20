import { useSearchParams } from 'next/navigation'

export const useAuthModalParams = () => {
    const searchParams = useSearchParams()
    const modalParam = searchParams?.get('modal') ?? ''
    const parts = modalParam.split('/')
    const mainModal = parts[0]
    const subModal = parts[1]

    return {
        isAuthModal: mainModal === 'auth',
        isLoginScreen: !subModal,
        isSignupScreen: subModal === 'signup'
    }
}
