import { useUpdateCommentReaction } from '@/features/reaction-comment'
import { useUpdatePostReaction } from '@/features/reaction-post'
import { TReaction } from '@/shared/types/reaction.types'
import { TUpdateEntityReactionHook } from '../../types'

export const useUpdateEntityReaction = ({ id, onSuccess, target }: TUpdateEntityReactionHook) => {
    const post = useUpdatePostReaction(onSuccess)
    const comment = useUpdateCommentReaction(onSuccess)

    const updateReaction = (reactionValueId: TReaction['id']) => {
        if (target === 'POST') post.updateReaction({ postId: id, reactionValueId })
        if (target === 'COMMENT') comment.updateReaction({ commentId: id, reactionValueId })
    }

    return { updateReaction, isLoading: post.isLoading || comment.isLoading }
}
