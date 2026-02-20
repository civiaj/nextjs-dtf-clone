import { TrashAppIcon } from '@/shared/icons'
import { TUser } from '@/shared/types/user.types'
import { Button } from '@/shared/ui/button'
import { useMuteUpdate } from '../hooks/useMuteUpdate'

export const UnmuteUserButton = ({ title, id }: { title?: string; id: TUser['id'] }) => {
    const { execute, isLoading } = useMuteUpdate()
    const handleUnmute = () => execute({ action: 'unmute', target: 'USER', targetId: id })

    return (
        <Button
            onClick={handleUnmute}
            title={title}
            disabled={isLoading}
            rounedness='full'
            variant='ghost'
            size='icon-base'>
            <TrashAppIcon size={18} />
        </Button>
    )
}
