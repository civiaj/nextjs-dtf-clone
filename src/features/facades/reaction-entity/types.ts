import {
    TReaction,
    TReactionConfig,
    TReactionEntityData,
    TReactionMetrics,
    TReactionTarget
} from '@/shared/types/reaction.types'
import { ButtonProps } from '@/shared/ui/button'

type TReactionBarBaseProps = {
    size: Extract<ButtonProps['size'], 'md' | 'sm'>
    className?: string
    reactions: TReactionMetrics['reactions']
}

export type TReactionBarProps = TReactionBarBaseProps & TUpdateEntityReactionHook
export type TReactionBarContext =
    | (Pick<TReactionBarProps, 'size' | 'id' | 'target'> & {
          handleReactionMutation: (reactionValueId: TReaction['id']) => void
          handleReactionBarClick: (e: React.MouseEvent) => void
          isLoading: boolean
      })
    | null
export type TReactionBarContextProviderProps = Pick<
    TReactionBarProps,
    'size' | 'id' | 'target' | 'onSuccess'
> & { children: React.ReactNode }

export type TUpdateEntityReactionHook<T extends TReactionTarget = TReactionTarget> = {
    onSuccess?: () => void
    id: TReactionConfig[T]['id']
    target: T
}

export type TReactionButtonProps = TReactionEntityData &
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'id'> & { children?: React.ReactNode }
