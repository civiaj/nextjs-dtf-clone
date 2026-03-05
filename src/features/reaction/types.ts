import {
    TReaction,
    TReactionConfig,
    TReactionEntityData,
    TReactionMetrics,
    ReactionTarget
} from '@/shared/types/reaction.types'
import { ButtonProps } from '@/shared/ui/button'

type TReactionBarBaseProps = {
    size: Extract<ButtonProps['size'], 'md' | 'sm'>
    className?: string
    reactions: TReactionMetrics['reactions']
}

export type TReactionBarProps<T extends ReactionTarget = ReactionTarget> = TReactionBarBaseProps & {
    onSuccess?: () => void
    id: TReactionConfig[T]['id']
    target: T
}

export type TReactionButtonProps = Pick<TReactionEntityData, 'id' | 'emoji' | 'name' | 'count'>
export type TReactionMutateFn = (reactionValueId: TReaction['id']) => void
