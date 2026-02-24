import { MAX_FILE_SIZE } from '@/shared/constants'
import { MediaUploadError, MediaUploadValidation } from './types'

const DEFAULT_ACCEPTED_MIME_TYPES = ['image/*', 'video/*'] as const

export const DEFAULT_MEDIA_UPLOAD_VALIDATION: MediaUploadValidation = {
    maxFileSizeBytes: MAX_FILE_SIZE,
    acceptedMimeTypes: DEFAULT_ACCEPTED_MIME_TYPES
}

const bytesToMegabytes = (bytes: number) => Math.round((bytes / 1024 / 1024) * 10) / 10

const matchesAcceptRule = (file: File, rule: string): boolean => {
    const normalizedRule = rule.trim().toLowerCase()
    if (!normalizedRule) return false

    if (normalizedRule.startsWith('.')) {
        return file.name.toLowerCase().endsWith(normalizedRule)
    }

    const fileType = file.type.toLowerCase()
    if (!fileType) return false

    if (normalizedRule.endsWith('/*')) {
        const typePrefix = normalizedRule.slice(0, -1)
        return fileType.startsWith(typePrefix)
    }

    return fileType === normalizedRule
}

export const fileMatchesAcceptedTypes = (
    file: File,
    acceptedMimeTypes: readonly string[]
): boolean => {
    if (acceptedMimeTypes.length === 0) return true
    return acceptedMimeTypes.some((rule) => matchesAcceptRule(file, rule))
}

export const validateMediaUploadFile = (
    file: File,
    validation: MediaUploadValidation
): MediaUploadError | null => {
    if (file.size > validation.maxFileSizeBytes) {
        return {
            code: 'file-too-large',
            message: `File is too large. Max size is ${bytesToMegabytes(validation.maxFileSizeBytes)} MB.`
        }
    }

    if (!fileMatchesAcceptedTypes(file, validation.acceptedMimeTypes)) {
        return {
            code: 'mime-not-allowed',
            message: `Unsupported file type: ${file.type || 'unknown'}.`
        }
    }

    return null
}
