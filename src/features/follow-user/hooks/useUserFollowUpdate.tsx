import { useCallback } from 'react'
import { useAuthGuard } from '@/entities/auth'
import { formatErrorMessage } from '@/lib/error'
import { showToast } from '@/shared/ui/toaster'
import { UpdateUserFollowInput } from '@/shared/validation/follow.schema'
import { useFollowUserMutation } from '../model/service'

type TOptions = {
    onSuccess?: () => void
    onError?: (err: unknown) => void
    onFinally?: () => void
}

export const useUserFollowUpdate = () => {
    const { promptLoginIfUnauthorized } = useAuthGuard()
    const [mutation, queryResult] = useFollowUserMutation()

    const execute = useCallback(
        (input: UpdateUserFollowInput, options: TOptions = {}) => {
            if (promptLoginIfUnauthorized()) {
                options.onFinally?.()
                return
            }

            mutation(input)
                .unwrap()
                .then(() => {
                    options.onSuccess?.()
                    const { action, id } = input
                    const msg =
                        action === 'create'
                            ? 'Вы подписались на пользователя'
                            : 'Вы отписались от пользователя'
                    showToast('success', { description: msg, id: '' + action + id })
                })
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
