import { useAuthGuard } from '@/entities/auth'
import { formatErrorMessage } from '@/lib/error'
import { TPost } from '@/shared/types/post.types'
import { TReaction } from '@/shared/types/reaction.types'
import { showToast } from '@/shared/ui/toaster'
import { useUpdatePostReactionMutation } from '../service'

export const useUpdatePostReaction = (onSuccess?: () => void) => {
    const { promptLoginIfUnauthorized } = useAuthGuard()
    const [updatePostReaction, { isLoading }] = useUpdatePostReactionMutation()

    const updateReaction = ({
        postId,
        reactionValueId
    }: {
        postId: TPost['id']
        reactionValueId: TReaction['id']
    }) => {
        if (promptLoginIfUnauthorized()) return

        updatePostReaction({ reactionValueId, targetId: postId })
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
