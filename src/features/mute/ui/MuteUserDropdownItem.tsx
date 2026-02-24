import { useIsOwner } from '@/entities/auth'
import { useMuteUpdate } from '@/features/mute/hooks/useMuteUpdate'
import { EyeCloseAppIcon, EyeOpenAppIcon } from '@/shared/icons'
import { TUser } from '@/shared/types/user.types'
import { DropdownMenuItem } from '@/shared/ui/dropdown-menu'

export const MuteUserDropdownItem = ({ id, isActive }: { isActive: boolean; id: TUser['id'] }) => {
    const { isOwner } = useIsOwner(id)
    const { execute, isLoading } = useMuteUpdate()

    if (isOwner) return null

    const handleMuteUpdate = () => {
        execute({ action: isActive ? 'unmute' : 'mute', target: 'USER', targetId: id })
    }

    const Icon = isActive ? EyeOpenAppIcon : EyeCloseAppIcon
    const title = isActive ? 'Разблокировать' : 'Заблокировать'

    return (
        <DropdownMenuItem
            onClick={handleMuteUpdate}
            disabled={isLoading}
            variant={isActive ? 'active' : 'default'}>
            <Icon />
            {title}
        </DropdownMenuItem>
    )
}
