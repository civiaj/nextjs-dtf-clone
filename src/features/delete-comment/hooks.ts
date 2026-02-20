import { useDeleteCommentMutation } from '@/entities/comment'
import { formatErrorMessage } from '@/lib/error'
// import { useRequireAuth } from '@/shared/hooks'
import { TComment } from '@/shared/types/comment.types'
import { showToast } from '@/shared/ui/toaster'

export const useDeleteComment = (id: TComment['id']) => {
    // const { user, requireAuth } = useRequireAuth()
    const [deleteComment] = useDeleteCommentMutation()

    const onDeleteComment = () => {
        // if (!requireAuth() || !user) return

        deleteComment({ id })
            .unwrap()
            .catch((error) => {
                showToast('warning', { description: formatErrorMessage(error) })
            })
    }

    return { onDeleteComment }
}
