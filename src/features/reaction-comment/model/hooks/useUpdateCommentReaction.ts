import { useAuthGuard } from '@/entities/auth'
import { formatErrorMessage } from '@/lib/error'
import { TComment } from '@/shared/types/comment.types'
import { TReaction } from '@/shared/types/reaction.types'
import { showToast } from '@/shared/ui/toaster'
import { useUpdateCommentReactionMutation } from '../service'

export const useUpdateCommentReaction = (onSuccess?: () => void) => {
    const { promptLoginIfUnauthorized } = useAuthGuard()
    const [updateCommentReaction, { isLoading }] = useUpdateCommentReactionMutation()

    const updateReaction = ({
        commentId,
        reactionValueId
    }: {
        commentId: TComment['id']
        reactionValueId: TReaction['id']
    }) => {
        if (promptLoginIfUnauthorized()) return

        updateCommentReaction({ reactionValueId, targetId: commentId })
            .unwrap()
            .then(() => {
                onSuccess?.()
            })
            .catch((err) => {
                showToast('warning', { description: formatErrorMessage(err) })
            })
    }

    return { updateReaction, isLoading }
}
