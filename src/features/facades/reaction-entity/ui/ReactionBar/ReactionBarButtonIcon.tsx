/* eslint-disable @next/next/no-img-element */

import { cn } from '@/shared/utils/common.utils'
import { TReactionBarProps, TReactionButtonProps } from '../../types'

export const ReactionBarButtonIcon = ({
    emoji,
    name,
    size
}: Pick<TReactionButtonProps, 'emoji' | 'name'> & { size: TReactionBarProps['size'] }) => {
    return (
        <img
            src={emoji}
            className={cn('shrink-0', {
                ['h-5 w-5']: size === 'md',
                ['h-4 w-4']: size === 'sm'
            })}
            alt={name}
        />
    )
}
