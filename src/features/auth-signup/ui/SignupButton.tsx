import Link from 'next/link'
import { Button } from '@/shared/ui/button'

export const SignupButton = () => {
    return (
        <Link href='?modal=auth/signup'>
            <Button
                className='rounded-full'
                variant={'outline'}>
                Создать профиль
            </Button>
        </Link>
    )
}
