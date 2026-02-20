import { useCallback } from 'react'
import { useAuthGuard } from '@/entities/auth'
import { formatErrorMessage } from '@/lib/error'
import { TComment } from '@/shared/types/comment.types'
import { showToast } from '@/shared/ui/toaster'
import { CreateCommentInput } from '@/shared/validation/comment.schema'
import { useSaveCommentMutation } from './service'

type TOptions = {
    onSuccess?: (comment: TComment) => void
    onError?: (err: unknown) => void
    onFinally?: () => void
}

export const useSaveComment = () => {
    const { promptLoginIfUnauthorized } = useAuthGuard()
    const [mutation, queryResult] = useSaveCommentMutation()

    const execute = useCallback(
        (args: CreateCommentInput, options: TOptions = {}) => {
            if (promptLoginIfUnauthorized()) {
                options.onFinally?.()
                return
            }

            mutation(args)
                .unwrap()
                .then((res) => options.onSuccess?.(res.result))
                .catch((err) => {
                    options.onError?.(err)
                    showToast('warning', { description: formatErrorMessage(err) })
                })
                .finally(() => options.onFinally?.())
        },
        [mutation, promptLoginIfUnauthorized]
    )

    return { execute, ...queryResult }
}
