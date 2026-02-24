import { fileTypeFromBuffer } from 'file-type'
import sharp from 'sharp'
import { ApiError } from '@/lib/error'
import { ERROR_MESSAGES } from '@/shared/constants'
import { IMAGE_EXTENSION_SET, MEDIA_LIMITS, VIDEO_EXTENSION_SET } from '../config'
import { TDetectedFile } from '../types'
import { normalizeExtension } from './normalizeExtension'
import { validateDeclaredMime } from './validateDeclaredMime'

export const detectAndValidateFile = async (file: File): Promise<TDetectedFile> => {
    if (!file.size || file.size > MEDIA_LIMITS.maxUploadBytes) {
        throw ApiError.BadRequest(ERROR_MESSAGES.MEDIA.BIG_SIZE)
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    if (!buffer.byteLength || buffer.byteLength > MEDIA_LIMITS.maxUploadBytes) {
        throw ApiError.BadRequest(ERROR_MESSAGES.MEDIA.BIG_SIZE)
    }

    const detected = await fileTypeFromBuffer(buffer)
    if (!detected) {
        throw ApiError.BadRequest(ERROR_MESSAGES.MEDIA.WRONG_FORMAT('unknown'))
    }

    const detectedExtension = normalizeExtension(detected.ext)
    validateDeclaredMime(file.type, detected.mime)

    if (IMAGE_EXTENSION_SET.has(detectedExtension)) {
        await validateImageBuffer(buffer)
        return {
            buffer,
            detectedMime: detected.mime,
            detectedExtension,
            kind: 'image'
        }
    }

    if (VIDEO_EXTENSION_SET.has(detectedExtension)) {
        return {
            buffer,
            detectedMime: detected.mime,
            detectedExtension,
            kind: 'video'
        }
    }

    throw ApiError.BadRequest(ERROR_MESSAGES.MEDIA.WRONG_FORMAT(detectedExtension))
}

const validateImageBuffer = async (buffer: Buffer): Promise<void> => {
    const metadata = await sharp(buffer, {
        limitInputPixels: MEDIA_LIMITS.maxInputPixels
    }).metadata()
    const width = metadata.width
    const height = metadata.height

    if (!width || !height) {
        throw ApiError.BadRequest(ERROR_MESSAGES.MEDIA.NO_RESOLUTION)
    }

    if (width < MEDIA_LIMITS.minWidthPx || height < MEDIA_LIMITS.minHeightPx) {
        throw ApiError.BadRequest(ERROR_MESSAGES.MEDIA.DIMENSION_TOO_SMALL)
    }

    if (width > MEDIA_LIMITS.maxInputDimensionPx || height > MEDIA_LIMITS.maxInputDimensionPx) {
        throw ApiError.BadRequest(ERROR_MESSAGES.MEDIA.DIMENSION_TOO_SMALL)
    }

    if (width * height > MEDIA_LIMITS.maxInputPixels) {
        throw ApiError.BadRequest(ERROR_MESSAGES.MEDIA.BIG_SIZE)
    }
}
