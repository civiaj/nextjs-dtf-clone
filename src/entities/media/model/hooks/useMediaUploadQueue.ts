'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { TMediaWithCaption } from '@/shared/types/media.types'
import { UploadMediaInput } from '@/shared/validation/media.validation'
import {
    MediaUploadMode,
    MediaUploadQueueItem,
    UseMediaUploadQueueParams,
    UseMediaUploadQueueResult
} from '../types'
import { uploadMediaWithApi } from '../uploadMediaApi'
import {
    clampProgress,
    createFilePreviewUrl,
    createQueueItemId,
    mergeUploadedMedia,
    normalizeMediaUploadError,
    revokePreviewUrl,
    toFileArray
} from '../utils'
import { DEFAULT_MEDIA_UPLOAD_VALIDATION, validateMediaUploadFile } from '../validation'

const DEFAULT_MAX_FILES = 4

const resolveMode = (
    mode: MediaUploadMode | undefined,
    maxFiles: number | undefined
): MediaUploadMode => {
    if (mode) return mode
    return (maxFiles ?? 1) > 1 ? 'multiple' : 'single'
}

const resolveMaxFiles = (mode: MediaUploadMode, maxFiles: number | undefined): number => {
    if (mode === 'single') return 1
    if (!maxFiles) return DEFAULT_MAX_FILES
    return Math.max(1, maxFiles)
}

export const useMediaUploadQueue = ({
    values,
    onChange,
    mode,
    maxFiles,
    disabled = false,
    validation,
    uploadOptions,
    transport = uploadMediaWithApi,
    onError
}: UseMediaUploadQueueParams): UseMediaUploadQueueResult => {
    const [queue, setQueue] = useState<MediaUploadQueueItem[]>([])
    const queueRef = useRef<MediaUploadQueueItem[]>([])
    const uploadedRef = useRef<TMediaWithCaption[]>([...values])
    const controllersRef = useRef<Map<string, AbortController>>(new Map())

    const resolvedMode = resolveMode(mode, maxFiles)
    const resolvedMaxFiles = resolveMaxFiles(resolvedMode, maxFiles)

    const validationConfig = useMemo(
        () => ({
            maxFileSizeBytes:
                validation?.maxFileSizeBytes ?? DEFAULT_MEDIA_UPLOAD_VALIDATION.maxFileSizeBytes,
            acceptedMimeTypes:
                validation?.acceptedMimeTypes?.length === 0
                    ? []
                    : (validation?.acceptedMimeTypes ??
                      DEFAULT_MEDIA_UPLOAD_VALIDATION.acceptedMimeTypes)
        }),
        [validation?.acceptedMimeTypes, validation?.maxFileSizeBytes]
    )

    const acceptAttribute = useMemo(
        () => validationConfig.acceptedMimeTypes.join(','),
        [validationConfig.acceptedMimeTypes]
    )

    const syncQueue = useCallback(
        (updater: (prev: MediaUploadQueueItem[]) => MediaUploadQueueItem[]) => {
            setQueue((prev) => {
                const next = updater(prev)
                queueRef.current = next
                return next
            })
        },
        []
    )

    const commitUploaded = useCallback(
        (updater: (prev: TMediaWithCaption[]) => TMediaWithCaption[]) => {
            const next = updater(uploadedRef.current)
            uploadedRef.current = next
            onChange(next)
        },
        [onChange]
    )

    const startUpload = useCallback(
        (queueItemId: string) => {
            if (disabled) return

            const queueItem = queueRef.current.find((item) => item.id === queueItemId)
            if (!queueItem || queueItem.status !== 'queued') return

            const controller = new AbortController()
            controllersRef.current.set(queueItemId, controller)

            syncQueue((prev) =>
                prev.map((item) =>
                    item.id === queueItemId
                        ? { ...item, status: 'uploading', progress: 0, error: null }
                        : item
                )
            )

            const file = queueItem.file
            const previewUrl = queueItem.previewUrl
            const input: UploadMediaInput = { file, ...uploadOptions }

            void transport({
                input,
                context: {
                    signal: controller.signal,
                    onProgress: (progress) => {
                        syncQueue((prev) =>
                            prev.map((item) =>
                                item.id === queueItemId
                                    ? { ...item, progress: clampProgress(progress) }
                                    : item
                            )
                        )
                    }
                }
            })
                .then((uploadedMedia) => {
                    controllersRef.current.delete(queueItemId)
                    revokePreviewUrl(previewUrl)

                    syncQueue((prev) => prev.filter((item) => item.id !== queueItemId))
                    commitUploaded((prev) => mergeUploadedMedia(prev, uploadedMedia, resolvedMode))
                })
                .catch((rawError) => {
                    controllersRef.current.delete(queueItemId)
                    const error = normalizeMediaUploadError(rawError)
                    const status = error.code === 'aborted' ? 'aborted' : 'error'

                    syncQueue((prev) =>
                        prev.map((item) =>
                            item.id === queueItemId
                                ? {
                                      ...item,
                                      status,
                                      progress: status === 'aborted' ? 0 : item.progress,
                                      error
                                  }
                                : item
                        )
                    )

                    if (error.code !== 'aborted') {
                        onError?.(error, file)
                    }
                })
        },
        [commitUploaded, disabled, onError, resolvedMode, syncQueue, transport, uploadOptions]
    )

    const addFiles = useCallback(
        (files: FileList | readonly File[] | null | undefined) => {
            if (disabled) return

            const incoming = toFileArray(files)
            if (incoming.length === 0) return

            const available = Math.max(
                0,
                resolvedMaxFiles - uploadedRef.current.length - queueRef.current.length
            )

            if (available <= 0) return

            const nextBatch = incoming.slice(0, available).map((file) => {
                const validationError = validateMediaUploadFile(file, validationConfig)

                return {
                    id: createQueueItemId(),
                    file,
                    progress: 0,
                    status: validationError ? 'error' : 'queued',
                    previewUrl: createFilePreviewUrl(file),
                    error: validationError
                } satisfies MediaUploadQueueItem
            })

            syncQueue((prev) => [...prev, ...nextBatch])

            nextBatch.forEach((item) => {
                if (item.error) onError?.(item.error, item.file)
            })
        },
        [disabled, onError, resolvedMaxFiles, syncQueue, validationConfig]
    )

    const removeUploaded = useCallback(
        (mediaId: number) => {
            commitUploaded((prev) => prev.filter((item) => item.media.id !== mediaId))
        },
        [commitUploaded]
    )

    const removeQueueItem = useCallback(
        (queueItemId: string) => {
            const controller = controllersRef.current.get(queueItemId)
            if (controller) {
                controller.abort()
                controllersRef.current.delete(queueItemId)
            }

            syncQueue((prev) => {
                const target = prev.find((item) => item.id === queueItemId)
                if (target) revokePreviewUrl(target.previewUrl)
                return prev.filter((item) => item.id !== queueItemId)
            })
        },
        [syncQueue]
    )

    const retryQueueItem = useCallback(
        (queueItemId: string) => {
            syncQueue((prev) =>
                prev.map((item) =>
                    item.id === queueItemId && item.status !== 'uploading'
                        ? { ...item, status: 'queued', progress: 0, error: null }
                        : item
                )
            )
        },
        [syncQueue]
    )

    const cancelQueueItem = useCallback(
        (queueItemId: string) => {
            const controller = controllersRef.current.get(queueItemId)
            if (controller) {
                controller.abort()
                return
            }

            syncQueue((prev) =>
                prev.map((item) =>
                    item.id === queueItemId
                        ? {
                              ...item,
                              status: 'aborted',
                              progress: 0,
                              error: { code: 'aborted', message: 'Upload canceled by user.' }
                          }
                        : item
                )
            )
        },
        [syncQueue]
    )

    const clearQueue = useCallback(() => {
        controllersRef.current.forEach((controller) => controller.abort())
        controllersRef.current.clear()

        syncQueue((prev) => {
            prev.forEach((item) => revokePreviewUrl(item.previewUrl))
            return []
        })
    }, [syncQueue])

    useEffect(() => {
        uploadedRef.current = [...values]
    }, [values])

    useEffect(() => {
        if (disabled) return

        queue.forEach((item) => {
            if (item.status === 'queued' && !controllersRef.current.has(item.id)) {
                startUpload(item.id)
            }
        })
    }, [disabled, queue, startUpload])

    useEffect(() => {
        const controllers = controllersRef.current
        return () => {
            controllers.forEach((controller) => controller.abort())
            controllers.clear()
            queueRef.current.forEach((item) => revokePreviewUrl(item.previewUrl))
        }
    }, [])

    const isUploading = queue.some((item) => item.status === 'uploading')
    const remainingSlots = Math.max(0, resolvedMaxFiles - values.length - queue.length)
    const isEmpty = queue.length + values.length === 0
    const isAtLimit = remainingSlots === 0

    return {
        queue,
        isUploading,
        isAtLimit,
        isEmpty,
        remainingSlots,
        acceptAttribute,
        addFiles,
        removeUploaded,
        removeQueueItem,
        retryQueueItem,
        cancelQueueItem,
        clearQueue
    }
}
