'use client'

import { useCallback } from 'react'
import { cn } from '@/shared/utils/common.utils'
import { ReactionBarButton } from './ReactionBarButton'
import { ReactionBarDefaultReaction } from './ReactionBarDefaultReaction'
import { ReactionBarDropdown } from './ReactionBarDropdown'
import { useReactionUpdate } from '../../model/hooks/useReactionUpdate'
import { TReactionBarProps, TReactionMutateFn } from '../../types'

export const ReactionBar = ({
    reactions,
    size,
    className,
    onSuccess,
    id,
    target
}: TReactionBarProps) => {
    const { execute, isLoading } = useReactionUpdate()
    const visibleReactions = reactions.items.filter((r) => r.count > 0)

    const handleReactionMutation = useCallback<TReactionMutateFn>(
        (reactionValueId) => {
            execute({ target, targetId: id, reactionValueId }, { onSuccess })
        },
        [execute, id, onSuccess, target]
    )

    return (
        <ul className={cn('flex flex-wrap items-center gap-2 sm:gap-3', className)}>
            {visibleReactions.map((reaction) => (
                <li key={reaction.id}>
                    <ReactionBarButton
                        id={reaction.id}
                        count={reaction.count}
                        emoji={reaction.emoji}
                        name={reaction.name}
                        size={size}
                        isLoading={isLoading}
                        onClick={() => handleReactionMutation(reaction.id)}
                        className={cn({
                            ['bg-active/20 ring-1 ring-active transition-all hover:bg-active/25 active:bg-active/30 disabled:opacity-100']:
                                reaction.id === reactions.activeReactionId
                        })}
                    />
                </li>
            ))}

            <ReactionBarDefaultReaction
                isShown={visibleReactions.length === 0}
                size={size}
                isLoading={isLoading}
                onReactionClick={handleReactionMutation}
            />
            <ReactionBarDropdown
                size={size}
                isLoading={isLoading}
                onReactionClick={handleReactionMutation}
            />
        </ul>
    )
}
