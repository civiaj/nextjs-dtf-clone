import Link from 'next/link'
import { LoginForm } from '@/features/auth-login'
import { ContainerPadding } from '@/shared/ui/box'
import { Text } from '@/shared/ui/text'
import { useAuthModalActions } from '../model/hooks/useAuthModalActions'

export const LoginScreen = () => {
    const { closeModal } = useAuthModalActions()
    return (
        <ContainerPadding
            withBottom
            className='flex flex-col gap-4'>
            <Text as='h1'>Вход</Text>
            <LoginForm onSuccess={closeModal} />
            <Text
                as='p'
                className='text-center'>
                Нет профиля?{' '}
                <Link
                    className='font-medium text-active hover:text-active/80'
                    href={'?modal=auth/signup'}>
                    Создать
                </Link>
            </Text>
        </ContainerPadding>
    )
}
