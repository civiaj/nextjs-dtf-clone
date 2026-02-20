import { useLogoutMutation } from '@/entities/auth'
import { LogOutAppIcon } from '@/shared/icons'
import { Button } from '@/shared/ui/button'

export const LogoutButton = () => {
    const [logout, { isLoading }] = useLogoutMutation()
    const handleLogout = () => {
        logout()
    }

    return (
        <Button
            variant={'ghost'}
            isLoading={isLoading}
            onClick={handleLogout}
            disabled={isLoading}>
            <LogOutAppIcon size={20} />
            Выйти
        </Button>
    )
}
