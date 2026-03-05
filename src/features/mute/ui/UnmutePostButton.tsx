import { EyeOpenAppIcon } from '@/shared/icons'
import { TPost } from '@/shared/types/post.types'
import { Button } from '@/shared/ui/button'
import { useMuteUpdate } from '../hooks/useMuteUpdate'

export const UnmutePostButton = ({ title, id }: { title?: string; id: TPost['id'] }) => {
    const { execute, isLoading } = useMuteUpdate()
    const handleUnmute = () => execute({ action: 'unmute', target: 'POST', targetId: id })

    return (
        <Button
            onClick={handleUnmute}
            title={title}
            disabled={isLoading}
            rounedness='full'
            variant='ghost'
            size='icon-base'>
            <EyeOpenAppIcon />
        </Button>
    )
}
