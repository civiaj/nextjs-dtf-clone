import { BanAppIcon } from '@/shared/icons'
import { Button } from '@/shared/ui/button'
import { UserAvatar } from '@/shared/ui/user-avatar'

type CommentItemBodyMutedProps = {
    onShow?: () => void
    title?: string
    buttonText?: string
}

export const CommentItemBodyMuted = ({
    onShow,
    title = 'Комментарий скрыт',
    buttonText = 'Показать комментарий'
}: CommentItemBodyMutedProps) => {
    return (
        <UserAvatar>
            <UserAvatar.Avatar
                asChild
                className='flex items-center justify-center bg-muted'>
                <BanAppIcon size={16} />
            </UserAvatar.Avatar>
            <UserAvatar.Details>
                <UserAvatar.Name name={title} />
                <UserAvatar.Extra asChild>
                    <Button
                        onClick={onShow}
                        className='text-sm sm:text-sm'
                        variant={'clean-active'}
                        size={'auto'}>
                        {buttonText}
                    </Button>
                </UserAvatar.Extra>
            </UserAvatar.Details>
        </UserAvatar>
    )
}
