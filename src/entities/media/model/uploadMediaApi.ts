'use client'

import { TMedia, TMediaResponse } from '@/shared/types/media.types'
import { UploadMediaInput } from '@/shared/validation/media.validation'
import { MediaUploadTransport } from './types'

type UploadRequestError = {
    message: string
    status?: number
    code?: 'aborted' | 'network'
}

const isRecord = (value: unknown): value is Record<string, unknown> => {
    return typeof value === 'object' && value !== null
}

const isUnauthorizedError = (error: unknown): boolean => {
    if (!isRecord(error)) return false
    return 'status' in error && error.status === 401
}

const getResponseMessage = (payload: unknown, fallback: string): string => {
    if (!isRecord(payload)) return fallback

    if ('message' in payload && typeof payload.message === 'string') {
        return payload.message
    }

    return fallback
}

const getResponseResult = (payload: unknown): TMedia | null => {
    if (!isRecord(payload)) return null
    if (!('result' in payload)) return null
    if (!isRecord(payload.result)) return null
    return payload.result as TMedia
}

const createAbortError = (): UploadRequestError => ({
    code: 'aborted',
    message: 'Upload canceled by user.'
})

const sendUploadRequest = (
    file: File,
    options: UploadMediaInput['options'],
    signal: AbortSignal,
    onProgress: (progress: number) => void
): Promise<TMedia> => {
    return new Promise((resolve, reject) => {
        if (signal.aborted) {
            reject(createAbortError())
            return
        }

        const xhr = new XMLHttpRequest()
        xhr.open('POST', '/api/upload')
        xhr.responseType = 'json'

        const onAbort = () => xhr.abort()

        const cleanup = () => {
            signal.removeEventListener('abort', onAbort)
        }

        signal.addEventListener('abort', onAbort, { once: true })

        xhr.upload.onprogress = (event: ProgressEvent<EventTarget>) => {
            if (!event.lengthComputable || event.total <= 0) return
            const progress = Math.round((event.loaded / event.total) * 100)
            onProgress(progress)
        }

        xhr.onload = () => {
            cleanup()
            const status = xhr.status
            const payload = xhr.response as TMediaResponse | unknown

            if (status >= 200 && status < 300) {
                const media = getResponseResult(payload)
                if (media) {
                    resolve(media)
                    return
                }

                reject({
                    status,
                    message: 'Invalid upload response.'
                } satisfies UploadRequestError)
                return
            }

            reject({
                status,
                message: getResponseMessage(payload, `Upload failed with status ${status}.`)
            } satisfies UploadRequestError)
        }

        xhr.onerror = () => {
            cleanup()
            reject({
                code: 'network',
                message: 'Network error while uploading.'
            } satisfies UploadRequestError)
        }

        xhr.onabort = () => {
            cleanup()
            reject(createAbortError())
        }

        const formData = new FormData()
        formData.append('media', file)

        if (options) {
            formData.append('options', JSON.stringify(options))
        }

        xhr.send(formData)
    })
}

const refreshAuthSession = async (signal: AbortSignal): Promise<void> => {
    const response = await fetch('/api/refresh', {
        method: 'POST',
        credentials: 'include',
        signal
    })

    if (!response.ok) {
        throw {
            status: response.status,
            message: 'Unable to refresh session.'
        } satisfies UploadRequestError
    }
}

export const uploadMediaWithApi: MediaUploadTransport = async ({ input, context }) => {
    try {
        return await sendUploadRequest(
            input.file,
            input.options,
            context.signal,
            context.onProgress
        )
    } catch (error) {
        if (!isUnauthorizedError(error)) throw error
        if (context.signal.aborted) throw createAbortError()

        await refreshAuthSession(context.signal)
        return sendUploadRequest(input.file, input.options, context.signal, context.onProgress)
    }
}
