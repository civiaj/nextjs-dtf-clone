import Link from 'next/link'
import { SignupForm } from '@/features/auth-signup'
import { ContainerPadding } from '@/shared/ui/box'
import { Text } from '@/shared/ui/text'
import { useAuthModalActions } from '../model/hooks/useAuthModalActions'

export const SignupScreen = () => {
    const { closeModal } = useAuthModalActions()
    return (
        <ContainerPadding
            withBottom
            className='flex flex-col gap-4'>
            <Text as='h1'>Создание профиля</Text>
            <SignupForm onSuccess={closeModal} />
            <Text
                as='p'
                className='text-center'>
                Уже зарегистрированы?{' '}
                <Link
                    className='font-medium text-active hover:underline'
                    href={'?modal=auth'}>
                    Войти
                </Link>
            </Text>
        </ContainerPadding>
    )
}
