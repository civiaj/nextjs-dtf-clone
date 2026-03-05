'use client'

import { memo } from 'react'
import { AnimatedNumber } from '@/shared/ui/animated-number'
import { Button } from '@/shared/ui/button'
import { cn } from '@/shared/utils/common.utils'
import { ReactionBarButtonIcon } from './ReactionBarButtonIcon'
import { reactionBarSizeConfig } from './size'
import { TReactionBarProps, TReactionButtonProps } from '../../types'

type TReactionBarButtonProps = TReactionButtonProps & {
    size: TReactionBarProps['size']
    isLoading: boolean
    onClick?: () => void
    children?: React.ReactNode
    className?: string
}

export const ReactionBarButton = memo(
    ({
        count,
        emoji,
        name,
        size,
        className,
        isLoading,
        onClick,
        children
    }: TReactionBarButtonProps) => {
        const sizeConfig = reactionBarSizeConfig[size]

        return (
            <Button
                aria-label={`reaction ${name}`}
                size={size}
                rounedness={'full'}
                variant={'secondary'}
                disabled={isLoading}
                onClick={onClick}
                className={cn('select-none', sizeConfig.svgClassName, className)}>
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
