import { forwardRef } from 'react'
import { TUser } from '@/shared/types/user.types'
import { PreviewContainer, PreviewItem } from '@/shared/ui/MediaPreview'
import { UserAvatar } from '@/shared/ui/user-avatar'

export const UserProfileAvatarImage = forwardRef<HTMLAnchorElement, Props>(
    ({ avatar, avatarColor, name, className }, ref) => {
        if (!avatar) {
            return (
                <UserAvatar.Avatar
                    className={className}
                    size='lg'
                    avatar={avatar}
                    avatarColor={avatarColor}
                    name={name}
                />
            )
        }

        return (
            <PreviewContainer className={className}>
                <PreviewItem
                    ref={ref}
                    media={avatar}>
                    <UserAvatar.Avatar
                        size='lg'
                        avatar={avatar}
                        avatarColor={avatarColor}
                        name={name}
                    />
                </PreviewItem>
            </PreviewContainer>
        )
    }
)

type Props = Pick<TUser, 'avatar' | 'avatarColor' | 'name'> & { className?: string }
UserProfileAvatarImage.displayName = 'UserProfileAvatarImage'
