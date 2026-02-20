import { useCallback } from 'react'
import { useAuthGuard } from '@/entities/auth'
import { formatErrorMessage } from '@/lib/error'
import { showToast } from '@/shared/ui/toaster'
import { UpdateBookmarkInput } from '@/shared/validation/bookmark.schema'
import { useBookmarkMutation } from '../model/service'

type TOptions = {
    onSuccess?: () => void
    onError?: (err: unknown) => void
    onFinally?: () => void
}

export const useBookmarkUpdate = () => {
    const { promptLoginIfUnauthorized } = useAuthGuard()
    const [mutation, queryResult] = useBookmarkMutation()

    const execute = useCallback(
        (input: UpdateBookmarkInput, options: TOptions = {}) => {
            if (promptLoginIfUnauthorized()) {
                options.onFinally?.()
                return
            }

            mutation(input)
                .unwrap()
                .then(() => options.onSuccess?.())
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
