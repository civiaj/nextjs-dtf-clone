import { TMedia, TMediaWithCaption } from '@/shared/types/media.types'
import { UploadMediaInput } from '@/shared/validation/media.validation'

export type MediaUploadMode = 'single' | 'multiple'

export type MediaUploadErrorCode =
    | 'file-too-large'
    | 'mime-not-allowed'
    | 'aborted'
    | 'network'
    | 'server'
    | 'unknown'

export interface MediaUploadError {
    code: MediaUploadErrorCode
    message: string
    status?: number
}

export interface MediaUploadValidation {
    maxFileSizeBytes: number
    acceptedMimeTypes: readonly string[]
}

export interface MediaUploadTransportContext {
    signal: AbortSignal
    onProgress: (progress: number) => void
}

export interface MediaUploadTransportParams {
    input: UploadMediaInput
    context: MediaUploadTransportContext
}

export type MediaUploadTransport = (params: MediaUploadTransportParams) => Promise<TMedia>

export type MediaUploadQueueStatus = 'queued' | 'uploading' | 'error' | 'aborted'

export interface MediaUploadQueueItem {
    id: string
    file: File
    progress: number
    status: MediaUploadQueueStatus
    previewUrl: string | null
    error: MediaUploadError | null
}

export interface UseMediaUploadQueueParams {
    values: TMediaWithCaption[]
    onChange: (value: TMediaWithCaption[]) => void
    mode?: MediaUploadMode
    maxFiles?: number
    disabled?: boolean
    validation?: Partial<MediaUploadValidation>
    uploadOptions?: Omit<UploadMediaInput, 'media'>
    transport?: MediaUploadTransport
    onError?: (error: MediaUploadError, file: File) => void
}

export interface UseMediaUploadQueueResult {
    queue: readonly MediaUploadQueueItem[]
    isUploading: boolean
    isAtLimit: boolean
    isEmpty: boolean
    remainingSlots: number
    acceptAttribute: string
    addFiles: (files: FileList | readonly File[] | null | undefined) => void
    removeUploaded: (mediaId: number) => void
    removeQueueItem: (queueItemId: string) => void
    retryQueueItem: (queueItemId: string) => void
    cancelQueueItem: (queueItemId: string) => void
    clearQueue: () => void
}
