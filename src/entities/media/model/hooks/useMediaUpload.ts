'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { TMedia } from '@/shared/types/media.types'
import { showToast } from '@/shared/ui/toaster'
import { UploadMediaInput } from '@/shared/validation/media.validation'
import { uploadMediaWithApi } from '../uploadMediaApi'
import { clampProgress, normalizeMediaUploadError } from '../utils'

type TUseMediaUploadFn = (input: UploadMediaInput) => Promise<TMedia | null>
type TUseMediaUploadState = {
    progressNum: number
    isLoading: boolean
    abort: () => void
}

export type TUseMediaUploadTuple = [TUseMediaUploadFn, TUseMediaUploadState]

export const useMediaUpload = (): TUseMediaUploadTuple => {
    const [progressNum, setProgressNum] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const activeControllerRef = useRef<AbortController | null>(null)
    const requestIdRef = useRef(0)

    const resetState = useCallback(() => {
        setIsLoading(false)
        setProgressNum(0)
    }, [])

    const abort = useCallback(() => {
        activeControllerRef.current?.abort()
        activeControllerRef.current = null
        resetState()
    }, [resetState])

    const upload = useCallback<TUseMediaUploadFn>(
        async (input) => {
            activeControllerRef.current?.abort()

            const controller = new AbortController()
            activeControllerRef.current = controller
            const requestId = ++requestIdRef.current

            setProgressNum(0)
            setIsLoading(true)

            try {
                return await uploadMediaWithApi({
                    input,
                    context: {
                        signal: controller.signal,
                        onProgress: (nextProgress) => setProgressNum(clampProgress(nextProgress))
                    }
                })
            } catch (rawError) {
                const error = normalizeMediaUploadError(rawError)

                if (error.code !== 'aborted') {
                    showToast('warning', { description: error.message })
                }

                return null
            } finally {
                if (requestId === requestIdRef.current) {
                    if (activeControllerRef.current === controller) {
                        activeControllerRef.current = null
                    }
                    resetState()
                }
            }
        },
        [resetState]
    )

    useEffect(() => {
        return () => {
            activeControllerRef.current?.abort()
            activeControllerRef.current = null
        }
    }, [])

    return [upload, { progressNum, isLoading, abort }]
}
