import { useCallback } from 'react'
import { TReaction } from '@/shared/types/reaction.types'
import { TReactionBarContextProviderProps } from '../../types'
import { useUpdateEntityReaction } from '../hooks/useUpdateReactionEntity'
import { ReactionBarContext } from '../reaction-bar-context/context'

export const ReactionBarContextProvider = ({
    children,
    onSuccess,
    id,
    target,
    size
}: TReactionBarContextProviderProps) => {
    const { isLoading, updateReaction } = useUpdateEntityReaction({ onSuccess, id, target })

    const handleReactionMutation = useCallback(
        (reactionValueId: TReaction['id']) => {
            updateReaction(reactionValueId)
        },
        [updateReaction]
    )

    const handleReactionBarClick = useCallback(
        (e: React.MouseEvent) => {
            const target = (e.target as HTMLElement).closest<HTMLButtonElement>(
                '[data-reaction-id]'
            )
            if (!target) return
            const reactionValueId = Number(target?.getAttribute('data-reaction-id'))
            if (Number.isNaN(reactionValueId)) return
            handleReactionMutation(reactionValueId)
        },
        [handleReactionMutation]
    )

    return (
        <ReactionBarContext.Provider
            value={{ id, target, size, handleReactionBarClick, isLoading, handleReactionMutation }}>
            {children}
        </ReactionBarContext.Provider>
    )
}
