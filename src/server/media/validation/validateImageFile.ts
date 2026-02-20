import sharp from 'sharp'
import { ApiError } from '@/lib/error'
import {
    MAX_FILE_SIZE,
    ERROR_MESSAGES,
    SUPPORTED_FILE_EXTENTIONS,
    MIN_FILE_WIDTH_PX,
    MIN_FILE_HEIGHT_PX
} from '@/shared/constants'

export const validateImageFile = async (file: File) => {
    const metadata = await sharp(await file.arrayBuffer()).metadata()
    const { width, height, size, format } = metadata

    if (!size || size > MAX_FILE_SIZE) {
        throw ApiError.BadRequest(ERROR_MESSAGES.MEDIA.BIG_SIZE)
    }

    const supported = SUPPORTED_FILE_EXTENTIONS.find((f) => f === format)

    if (!format || !supported) {
        throw ApiError.BadRequest(ERROR_MESSAGES.MEDIA.WRONG_FORMAT(format))
    }

    if (width === undefined || height === undefined) {
        throw ApiError.BadRequest(ERROR_MESSAGES.MEDIA.NO_RESOLUTION)
    }

    if (width < MIN_FILE_WIDTH_PX || height < MIN_FILE_HEIGHT_PX) {
        throw ApiError.BadRequest(ERROR_MESSAGES.MEDIA.DIMENSION_TOO_SMALL)
    }
}

export default validateImageFile
