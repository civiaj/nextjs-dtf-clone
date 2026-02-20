'use client'

import { TUser } from '@/shared/types/user.types'
import { cn } from '@/shared/utils/common.utils'
import { UserProfileCoverImage } from './UserProfileCoverImage'
import { UserProfileCoverOwnerOverlay } from './UserProfileCoverOwnerOverlay'

export const UserProfileCover = ({
    cover,
    coverY,
    id,
    isOwner,
    className
}: Pick<TUser, 'cover' | 'coverY' | 'id'> & {
    isOwner: boolean
    className?: string
}) => {
    return (
        <div
            className={cn(
                'group relative aspect-[5/2] bg-foreground/10 sm:aspect-[3/1]',
                className
            )}>
            {isOwner ? (
                <UserProfileCoverOwnerOverlay
                    id={id}
                    cover={cover}
                    coverY={coverY}
                />
            ) : (
                <UserProfileCoverImage
                    cover={cover}
                    coverY={coverY}
                />
            )}
        </div>
    )
}
