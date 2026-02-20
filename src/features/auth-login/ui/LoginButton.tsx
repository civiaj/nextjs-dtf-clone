import Link from 'next/link'
import { Button } from '@/shared/ui/button'

export const LoginButton = () => {
    return (
        <Link href='?modal=auth'>
            <Button
                rounedness={'full'}
                variant={'active'}>
                Войти
            </Button>
        </Link>
    )
}
