import { TrashAppIcon } from '@/shared/icons'
import { UserAvatar } from '@/shared/ui/user-avatar'

export const CommentItemBodyDeleted = () => {
    return (
        <UserAvatar>
            <UserAvatar.Avatar
                asChild
                className='flex items-center justify-center bg-muted'>
                <TrashAppIcon size={16} />
            </UserAvatar.Avatar>
            <UserAvatar.Details>
                <UserAvatar.Name name='Комментарий удален' />
            </UserAvatar.Details>
        </UserAvatar>
    )
}
