import { Readable } from 'stream'
import { ApiError } from '@/lib/error'
import ffmpeg from '@/server/ffmpeg'
import {
    MAX_FILE_SIZE,
    ERROR_MESSAGES,
    SUPPORTED_FILE_EXTENTIONS,
    MAX_VIDEO_DURATION,
    MIN_FILE_WIDTH_PX,
    MIN_FILE_HEIGHT_PX
} from '@/shared/constants'

export const validateVideoFile = async (file: File) => {
    if (file.size > MAX_FILE_SIZE) throw ApiError.BadRequest(ERROR_MESSAGES.MEDIA.BIG_SIZE)
    const stream = new Readable()
    stream.push(Buffer.from(await file.arrayBuffer()))
    stream.push(null)

    const metadata = await new Promise<ffmpeg.FfprobeData>((resolve, reject) => {
        ffmpeg(stream).ffprobe((err, metadata) => {
            if (err) {
                console.log({ err })
                reject()
            } else resolve(metadata)
        })
    })

    if (!metadata || !metadata.format) throw ApiError.BadRequest(ERROR_MESSAGES.MEDIA.NO_META)

    const { duration, format_name } = metadata.format
    const { width, height } = metadata.streams.find((s) => s.codec_type === 'video') || {}

    if (
        !format_name ||
        !format_name.split(',').some((format) => {
            const supported = SUPPORTED_FILE_EXTENTIONS.find((f) => f === format)
            return Boolean(supported)
        })
    ) {
        throw ApiError.BadRequest(ERROR_MESSAGES.MEDIA.WRONG_FORMAT(format_name?.split(',')[0]))
    }

    if (!duration || duration > MAX_VIDEO_DURATION) {
        throw ApiError.BadRequest(ERROR_MESSAGES.MEDIA.BIG_DURATION)
    }

    if (width === undefined || height === undefined) {
        throw ApiError.BadRequest(ERROR_MESSAGES.MEDIA.NO_RESOLUTION)
    }

    if (width < MIN_FILE_WIDTH_PX || height < MIN_FILE_HEIGHT_PX) {
        throw ApiError.BadRequest(ERROR_MESSAGES.MEDIA.DIMENSION_TOO_SMALL)
    }
}
