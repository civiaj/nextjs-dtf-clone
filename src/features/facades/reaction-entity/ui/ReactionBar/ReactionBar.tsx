'use client'

import { cn } from '@/shared/utils/common.utils'
import { ReactionBarButton } from './ReactionBarButton'
import { ReactionBarDefatultReaction } from './ReactionBarDefatultReaction'
import { ReactionBarDropdown } from './ReactionBarDropdown'
import { ReactionBarContextProvider } from '../../model/reaction-bar-context/Provider'
import { useReactionBarContext } from '../../model/reaction-bar-context/useReactionBarContext'
import { TReactionBarProps } from '../../types'

export const ReactionBar = ({
    reactions,
    size,
    className,
    onSuccess,
    id,
    target
}: TReactionBarProps) => {
    return (
        <ReactionBarContextProvider
            id={id}
            target={target}
            size={size}
            onSuccess={onSuccess}>
            <ReactionBarContent
                className={className}
                reactions={reactions}
            />
        </ReactionBarContextProvider>
    )
}

const ReactionBarContent = ({
    reactions,
    className
}: Pick<TReactionBarProps, 'className' | 'reactions'>) => {
    const { handleReactionBarClick } = useReactionBarContext()
    const visibleReactions = reactions.items.filter((r) => r.count > 0)

    return (
        <ul
            onClick={handleReactionBarClick}
            className={cn('flex flex-wrap items-center gap-1 sm:gap-2', className)}>
            {visibleReactions.map((r) => (
                <li key={r.id}>
                    <ReactionBarButton
                        id={r.id}
                        count={r.count}
                        emoji={r.emoji}
                        name={r.name}
                        className={cn({
                            ['bg-active/20 ring-1 ring-active transition-all hover:bg-active/25 active:bg-active/30 disabled:opacity-100']:
                                r.id === reactions.activeReactionId
                        })}
                    />
                </li>
            ))}

            <ReactionBarDefatultReaction isShown={visibleReactions.length === 0} />
            <ReactionBarDropdown />
        </ul>
    )
}
