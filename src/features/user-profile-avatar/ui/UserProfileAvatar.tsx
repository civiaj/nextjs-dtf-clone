'use client'

import { TUser } from '@/shared/types/user.types'
import { UserProfileAvatarImage } from './UserProfileAvatarImage'
import { UserProfileAvatarOwnerOverlay } from './UserProfileAvatarOwnerOverlay'

export const UserProfileAvatar = ({
    avatar,
    avatarColor,
    isOwner,
    name
}: Pick<TUser, 'avatar' | 'avatarColor' | 'name'> & { isOwner: boolean }) => {
    return (
        <div className='relative z-[1] overflow-hidden rounded-full border-4 border-card bg-card'>
            {isOwner ? (
                <UserProfileAvatarOwnerOverlay
                    avatar={avatar}
                    avatarColor={avatarColor}
                    name={name}
                />
            ) : (
                <UserProfileAvatarImage
                    avatar={avatar}
                    avatarColor={avatarColor}
                    name={name}
                />
            )}
        </div>
    )
}
