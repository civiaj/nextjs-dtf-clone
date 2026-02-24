import { forwardRef } from 'react'
import { TUser } from '@/shared/types/user.types'
import { AppImage } from '@/shared/ui/media'

export const UserProfileCoverImage = forwardRef<HTMLDivElement, Pick<TUser, 'cover' | 'coverY'>>(
    ({ coverY = 50, cover }, ref) => {
        if (!cover) return null

        return (
            <div
                ref={ref}
                style={{ '--coverY': `${coverY}%` } as React.CSSProperties}
                className='h-full w-full overflow-hidden bg-cover bg-center bg-no-repeat'>
                <AppImage
                    media={cover}
                    className='h-full w-full object-cover'
                    style={{ objectPosition: `0 var(--coverY)` }}
                />
            </div>
        )
    }
)

UserProfileCoverImage.displayName = 'UserProfileCoverImage'
