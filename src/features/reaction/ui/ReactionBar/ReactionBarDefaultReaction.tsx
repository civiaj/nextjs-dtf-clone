import { useAppSelector } from '@/lib/store'
import { HeartAppIcon } from '@/shared/icons'
import { ReactionBarButton } from './ReactionBarButton'
import { TReactionBarProps, TReactionMutateFn } from '../../types'

type TReactionBarDefaultReactionProps = {
    isShown: boolean
    size: TReactionBarProps['size']
    isLoading: boolean
    onReactionClick: TReactionMutateFn
}

export const ReactionBarDefaultReaction = ({
    isShown,
    size,
    isLoading,
    onReactionClick
}: TReactionBarDefaultReactionProps) => {
    const reaction = useAppSelector((state) => state.assets.defaultReactionValue)

    if (!isShown || !reaction) return null

    const { emoji, id, name } = reaction

    return (
        <li>
            <ReactionBarButton
                count={0}
                emoji={emoji}
                id={id}
                name={name}
                size={size}
                isLoading={isLoading}
                onClick={() => onReactionClick(id)}>
                <HeartAppIcon />
            </ReactionBarButton>
        </li>
    )
}
