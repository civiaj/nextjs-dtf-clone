import { useCallback } from 'react'
import { useAuthGuard, useUpdateOwnerMutation } from '@/entities/auth'
import { formatErrorMessage } from '@/lib/error'
import { TUser } from '@/shared/types/user.types'
import { showToast } from '@/shared/ui/toaster'
import { PatchUserSchemaInput } from '@/shared/validation/user.schema'

type TOptions = {
    onSuccess?: (user: TUser) => void
    onError?: (err: unknown) => void
    onFinally?: () => void
}

export const useUpdateOwnerBlog = () => {
    const { promptLoginIfUnauthorized } = useAuthGuard()
    const [mutation, queryResult] = useUpdateOwnerMutation()

    const execute = useCallback(
        (input: Pick<PatchUserSchemaInput, 'description' | 'name'>, options: TOptions = {}) => {
            if (promptLoginIfUnauthorized()) {
                options.onFinally?.()
                return
            }

            mutation(input)
                .unwrap()
                .then((res) => {
                    options.onSuccess?.(res.result)
                    showToast('success', { description: 'Данные блога обновлены.' })
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
