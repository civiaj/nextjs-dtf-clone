'use client'

import { memo } from 'react'
import { AnimatedNumber } from '@/shared/ui/animated-number'
import { Button } from '@/shared/ui/button'
import { cn } from '@/shared/utils/common.utils'
import { ReactionBarButtonIcon } from './ReactionBarButtonIcon'
import { useReactionBarContext } from '../../model/reaction-bar-context/useReactionBarContext'
import { TReactionButtonProps } from '../../types'

export const ReactionBarButton = memo(
    ({ count, emoji, name, id, className, children, ...buttonProps }: TReactionButtonProps) => {
        const { isLoading, size } = useReactionBarContext()

        return (
            <Button
                aria-label={`reaction ${name}`}
                data-reaction-id={id}
                size={size}
                rounedness={'full'}
                variant={'secondary'}
                disabled={isLoading}
                className={cn(
                    'select-none gap-1',
                    { ['[&_svg]:h-4 [&_svg]:w-4']: size === 'sm' },
                    { ['[&_svg]:h-5 [&_svg]:w-5']: size === 'md' },
                    className
                )}
                {...buttonProps}>
                {children ? (
                    children
                ) : (
                    <>
                        <ReactionBarButtonIcon
                            size={size}
                            emoji={emoji}
                            name={name}
                        />
                        <AnimatedNumber value={count} />
                    </>
                )}
            </Button>
        )
    }
)

ReactionBarButton.displayName = 'ReactionBarButton'
