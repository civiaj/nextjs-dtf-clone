import { useCallback } from 'react'
import { useAuthGuard } from '@/entities/auth'
import { formatErrorMessage } from '@/lib/error'
import { showToast } from '@/shared/ui/toaster'
import { CreateMuteInput } from '@/shared/validation/mute.schema'
import { useMuteMutation } from '../model/service'

type TOptions = {
    onSuccess?: () => void
    onError?: (err: unknown) => void
    onFinally?: () => void
}

export const useMuteUpdate = () => {
    const { promptLoginIfUnauthorized } = useAuthGuard()
    const [mutation, queryResult] = useMuteMutation()

    const execute = useCallback(
        (input: CreateMuteInput, options: TOptions = {}) => {
            if (promptLoginIfUnauthorized()) {
                options.onFinally?.()
                return
            }

            mutation(input)
                .unwrap()
                .then(() => {
                    options.onSuccess?.()
                    showToast('success', { description: getSuccessMuteMessage(input) })
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

const getSuccessMuteMessage = (input: CreateMuteInput): string => {
    if (input.action === 'mute' && input.target === 'USER') {
        return 'Пользователь заблокирован'
    } else if (input.action === 'unmute' && input.target === 'USER') {
        return 'Пользователь разблокирован'
    } else if (input.action === 'mute' && input.target === 'POST') {
        return 'Пост заблокирован'
    } else if (input.action === 'unmute' && input.target === 'POST') {
        return 'Пост разблокирован'
    } else {
        return 'Действие выполнено успешно'
    }
}
