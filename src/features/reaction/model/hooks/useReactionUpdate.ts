import { useCallback } from 'react'
import { useAuthGuard } from '@/entities/auth'
import { formatErrorMessage } from '@/lib/error'
import { showToast } from '@/shared/ui/toaster'
import { TUpdateReactionInput } from '@/shared/validation/reaction.schema'
import { useSetReactionMutation } from '../service'

type TOptions = {
    onSuccess?: () => void
    onError?: (err: unknown) => void
    onFinally?: () => void
}

export const useReactionUpdate = () => {
    const { promptLoginIfUnauthorized } = useAuthGuard()
    const [mutation, queryResult] = useSetReactionMutation()

    const execute = useCallback(
        (input: TUpdateReactionInput, options: TOptions = {}) => {
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
