import { useCallback, useRef, useState } from 'react'
import { formatErrorMessage } from '@/lib/error'
import { MAX_FILE_SIZE } from '@/shared/constants'
import { TMedia } from '@/shared/types/media.types'
import { showToast } from '@/shared/ui/toaster'
import { MediaUploadSchemaInput } from '@/shared/validation/media/mediaSchema'
import { uploadMediaFile } from '../service'

export const useMediaUpload = (onSuccess?: (media: TMedia) => void, onError?: () => void) => {
    const [progress, setProgress] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const abortRef = useRef<() => void>(null)

    const upload = useCallback(
        async (payload: MediaUploadSchemaInput) => {
            if (payload.file.size > MAX_FILE_SIZE) {
                showToast('warning', { description: 'Файл слишком большой' })
                onError?.()
                return null
            }

            setProgress(0)
            setIsLoading(true)

            const uploadPromise = uploadMediaFile(payload, { onProgress: setProgress })
            abortRef.current = uploadPromise.abort

            try {
                const response = await uploadPromise
                onSuccess?.(response.result)
                return response.result
            } catch (error) {
                showToast('warning', { description: formatErrorMessage(error) })
                onError?.()
                return null
            } finally {
                setIsLoading(false)
                setProgress(0)
                abortRef.current = null
            }
        },
        [onSuccess, onError]
    )

    const abort = useCallback(() => {
        abortRef.current?.()
        setIsLoading(false)
        setProgress(0)
    }, [])

    return { abort, upload, progress, isLoading }
}
