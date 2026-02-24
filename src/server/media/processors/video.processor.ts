import sharp from 'sharp'
import { ApiError } from '@/lib/error'
import ffmpeg from '@/server/ffmpeg'
import { ERROR_MESSAGES } from '@/shared/constants'
import { UploadMediaDTO } from '@/shared/validation/media.validation'
import { MEDIA_LIMITS } from '../config'
import { LocalMediaStorage } from '../local-media.storage'
import { TProcessedMedia } from '../types'
import { createBlurDataURL } from '../utils/createBlurDataURL'
import { createMediaHashFromPath } from '../utils/createMediaHash'
import { probeMediaWithFfmpeg, runFfmpegCommand } from '../utils/ffmpeg'

type TVideoMetadata = {
    width: number
    height: number
    durationSec: number
}

export class VideoProcessor {
    constructor(private storage: LocalMediaStorage) {}

    async process(
        buffer: Buffer,
        detectedExtension: string,
        options?: UploadMediaDTO['options']
    ): Promise<TProcessedMedia> {
        const inputPath = await this.storage.createTempFile(detectedExtension)
        await this.storage.writeFile(inputPath, buffer)

        try {
            const metadata = await this.readAndValidateMetadata(inputPath, options)

            if (options?.context === 'AVATAR' || options?.context === 'COVER') {
                return await this.processAsAnimatedAvatar(inputPath)
            }

            return await this.processAsMp4Video(inputPath, metadata)
        } catch (error) {
            if (error instanceof ApiError) throw error
            throw ApiError.BadRequest(ERROR_MESSAGES.MEDIA.PROCESSING_ERROR)
        } finally {
            await this.cleanupFilesQuietly([inputPath])
        }
    }

    private async processAsAnimatedAvatar(inputPath: string): Promise<TProcessedMedia> {
        const output = await this.storage.createOutputFile('images', 'webp')

        try {
            const command = ffmpeg(inputPath)
                .outputOptions([
                    `-t ${MEDIA_LIMITS.maxAvatarDurationSec}`,
                    '-loop 0',
                    '-q:v 70',
                    '-preset default',
                    '-vf scale=trunc(iw/2)*2:trunc(ih/2)*2'
                ])
                .outputFormat('webp')

            await runFfmpegCommand(
                command,
                (prepared) => prepared.save(output.absolutePath),
                MEDIA_LIMITS.ffmpegTimeoutMs
            )

            const imageMetadata = await sharp(output.absolutePath).metadata()
            const width = imageMetadata.width
            const height = imageMetadata.height

            if (!width || !height) {
                throw ApiError.BadRequest(ERROR_MESSAGES.MEDIA.NO_RESOLUTION)
            }

            const size = await this.storage.getFileSize(output.absolutePath)
            const blurDataURL = await createBlurDataURL(output.absolutePath)
            const processed_hash = await createMediaHashFromPath(output.absolutePath)

            return {
                media: {
                    src: output.publicPath,
                    type: 'image',
                    format: 'webp',
                    blurDataURL,
                    width,
                    height,
                    size,
                    thumbnail: null,
                    duration: null,
                    processed_hash
                },
                cleanup: async () => {
                    await this.storage.removeFile(output.absolutePath)
                }
            }
        } catch (error) {
            await this.cleanupFilesQuietly([output.absolutePath])
            throw error
        }
    }

    private async processAsMp4Video(
        inputPath: string,
        fallbackMetadata: TVideoMetadata
    ): Promise<TProcessedMedia> {
        const outputVideo = await this.storage.createOutputFile('videos', 'mp4')
        const outputThumbnail = await this.storage.createOutputFile('videos', 'webp')

        try {
            const transcodeCommand = ffmpeg(inputPath)
                .outputOptions([
                    '-movflags +faststart',
                    '-c:v libx264',
                    '-preset medium',
                    '-crf 28',
                    '-pix_fmt yuv420p',
                    '-c:a aac',
                    '-b:a 128k',
                    '-vf scale=trunc(min(iw\\,4096)/2)*2:trunc(min(ih\\,4096)/2)*2:force_original_aspect_ratio=decrease'
                ])
                .format('mp4')

            await runFfmpegCommand(
                transcodeCommand,
                (prepared) => prepared.save(outputVideo.absolutePath),
                MEDIA_LIMITS.ffmpegTimeoutMs
            )

            const thumbnailCommand = ffmpeg(outputVideo.absolutePath)
                .outputOptions([
                    '-vf thumbnail,scale=360:-1:force_original_aspect_ratio=decrease',
                    '-frames:v 1'
                ])
                .format('webp')

            await runFfmpegCommand(
                thumbnailCommand,
                (prepared) => prepared.save(outputThumbnail.absolutePath),
                MEDIA_LIMITS.ffmpegTimeoutMs
            )

            const processedMetadata = await this.readAndValidateMetadata(outputVideo.absolutePath)
            const normalizedDuration = Math.max(
                1,
                Math.round(processedMetadata.durationSec || fallbackMetadata.durationSec)
            )

            const size = await this.storage.getFileSize(outputVideo.absolutePath)
            const blurDataURL = await createBlurDataURL(outputThumbnail.absolutePath)
            const processed_hash = await createMediaHashFromPath(outputVideo.absolutePath)

            return {
                media: {
                    src: outputVideo.publicPath,
                    type: 'video',
                    format: 'mp4',
                    duration: normalizedDuration,
                    width: processedMetadata.width,
                    height: processedMetadata.height,
                    size,
                    blurDataURL,
                    thumbnail: outputThumbnail.publicPath,
                    processed_hash
                },
                cleanup: async () => {
                    await this.storage.removeFiles([
                        outputVideo.absolutePath,
                        outputThumbnail.absolutePath
                    ])
                }
            }
        } catch (error) {
            await this.cleanupFilesQuietly([outputVideo.absolutePath, outputThumbnail.absolutePath])
            throw error
        }
    }

    private async cleanupFilesQuietly(filePaths: string[]): Promise<void> {
        for (const filePath of filePaths) {
            try {
                await this.storage.removeFile(filePath)
            } catch (cleanupError) {
                console.warn('media file cleanup failed', { filePath, cleanupError })
            }
        }
    }

    private async readAndValidateMetadata(
        filePath: string,
        _options?: UploadMediaDTO['options']
    ): Promise<TVideoMetadata> {
        const probeData = await probeMediaWithFfmpeg(filePath, MEDIA_LIMITS.ffprobeTimeoutMs)
        const stream = probeData.streams.find((candidate) => candidate.codec_type === 'video')

        if (!stream) {
            throw ApiError.BadRequest(ERROR_MESSAGES.MEDIA.NO_META)
        }

        const width = stream.width
        const height = stream.height
        const durationCandidate = Number(probeData.format.duration ?? stream.duration ?? 0)

        if (!width || !height) {
            throw ApiError.BadRequest(ERROR_MESSAGES.MEDIA.NO_RESOLUTION)
        }

        if (
            width < MEDIA_LIMITS.minWidthPx ||
            height < MEDIA_LIMITS.minHeightPx ||
            width > MEDIA_LIMITS.maxInputDimensionPx ||
            height > MEDIA_LIMITS.maxInputDimensionPx
        ) {
            throw ApiError.BadRequest(ERROR_MESSAGES.MEDIA.DIMENSION_TOO_SMALL)
        }

        if (!Number.isFinite(durationCandidate) || durationCandidate <= 0) {
            throw ApiError.BadRequest(ERROR_MESSAGES.MEDIA.NO_META)
        }

        if (durationCandidate > MEDIA_LIMITS.maxVideoDurationSec) {
            throw ApiError.BadRequest(ERROR_MESSAGES.MEDIA.BIG_DURATION)
        }

        return { width, height, durationSec: durationCandidate }
    }
}
