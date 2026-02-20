import { useAppSelector } from '@/lib/store'
import { HeartAppIcon } from '@/shared/icons'
import { ReactionBarButton } from './ReactionBarButton'

export const ReactionBarDefatultReaction = ({ isShown }: { isShown: boolean }) => {
    if (!isShown) return null

    return <ReactionBarDefatultReactionContent />
}

const ReactionBarDefatultReactionContent = () => {
    const reaction = useAppSelector((state) => state.assets.defaultReactionValue)

    if (!reaction) return null

    const { emoji, id, name } = reaction

    return (
        <li>
            <ReactionBarButton
                count={0}
                emoji={emoji}
                id={id}
                name={name}>
                <HeartAppIcon />
            </ReactionBarButton>
        </li>
    )
}
