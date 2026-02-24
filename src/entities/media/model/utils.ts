import { MediaToolDataItem } from '@/entities/editor/model/types'
import { TMedia, TMediaWithCaption } from '@/shared/types/media.types'
import { MediaUploadError, MediaUploadMode } from './types'

const ABORT_MESSAGE = 'Upload canceled by user.'
type UploadedMedia = MediaToolDataItem['media']
type UploadedImageMedia = Extract<UploadedMedia, { type: 'image' }>
type UploadedVideoMedia = Extract<UploadedMedia, { type: 'video' }>

const isRecord = (value: unknown): value is Record<string, unknown> => {
    return typeof value === 'object' && value !== null
}

const isImageMediaForEditor = (media: TMedia): media is UploadedImageMedia => {
    return (
        media.type === 'image' &&
        media.duration === null &&
        media.thumbnail === null &&
        (media.format === 'webp' || media.format === 'jpeg')
    )
}

const isVideoMediaForEditor = (media: TMedia): media is UploadedVideoMedia => {
    return (
        media.type === 'video' &&
        typeof media.duration === 'number' &&
        typeof media.thumbnail === 'string' &&
        (media.format === 'mp4' || media.format === 'gif')
    )
}

const hasAbortSignature = (error: unknown): boolean => {
    if (typeof DOMException !== 'undefined' && error instanceof DOMException) {
        return error.name === 'AbortError'
    }

    if (error instanceof Error) return error.name === 'AbortError'

    if (isRecord(error)) {
        if ('code' in error && error.code === 'aborted') return true
        if ('name' in error && error.name === 'AbortError') return true
    }

    return false
}

export const createQueueItemId = (): string => {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID()
    }

    return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export const toFileArray = (files: FileList | readonly File[] | null | undefined): File[] => {
    if (!files) return []
    return Array.isArray(files) ? [...files] : Array.from(files)
}

export const createFilePreviewUrl = (file: File): string | null => {
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
        return null
    }

    return URL.createObjectURL(file)
}

export const revokePreviewUrl = (previewUrl: string | null) => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
}

export const clampProgress = (progress: number): number => {
    if (!Number.isFinite(progress)) return 0
    if (progress < 0) return 0
    if (progress > 100) return 100
    return Math.round(progress)
}

export const normalizeMediaUploadError = (error: unknown): MediaUploadError => {
    if (hasAbortSignature(error)) {
        return {
            code: 'aborted',
            message: ABORT_MESSAGE
        }
    }

    if (isRecord(error)) {
        const maybeStatus = 'status' in error ? error.status : undefined
        const status = typeof maybeStatus === 'number' ? maybeStatus : undefined
        const maybeMessage = 'message' in error ? error.message : undefined
        const message =
            typeof maybeMessage === 'string' && maybeMessage.trim().length > 0
                ? maybeMessage
                : status
                  ? `Upload failed with status ${status}.`
                  : 'Upload failed.'

        if (status && status >= 500) {
            return { code: 'server', status, message }
        }

        if (status && status >= 400) {
            return { code: 'unknown', status, message }
        }

        if ('code' in error && error.code === 'network') {
            return { code: 'network', message }
        }
    }

    if (error instanceof Error) {
        const networkError = /network|failed to fetch/i.test(error.message)
        return {
            code: networkError ? 'network' : 'unknown',
            message: error.message || 'Upload failed.'
        }
    }

    return {
        code: 'unknown',
        message: 'Upload failed.'
    }
}

export const mergeUploadedMedia = (
    current: TMediaWithCaption[],
    incoming: TMedia,
    mode: MediaUploadMode
): TMediaWithCaption[] => {
    if (mode === 'single') return [createUploadedMedia(incoming)]
    if (current.some((item) => item.media.id === incoming.id)) return [...current]
    return [...current, createUploadedMedia(incoming)]
}

const createUploadedMedia = (media: TMedia): MediaToolDataItem => {
    if (isImageMediaForEditor(media) || isVideoMediaForEditor(media)) {
        return { media, text: '' }
    }
    throw new Error('Unsupported media type.')
}

export const updateSrcIfVideo = (media: Partial<TMedia>): Partial<TMedia> => {
    if ('type' in media && typeof media.type === 'string') {
        return { ...media, src: media.thumbnail ?? media.src }
    }

    return media
}
