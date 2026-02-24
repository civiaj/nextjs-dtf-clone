import sharp from 'sharp'
import { ApiError } from '@/lib/error'
import { ERROR_MESSAGES } from '@/shared/constants'
import { MEDIA_LIMITS } from '../config'
import { LocalMediaStorage } from '../local-media.storage'
import { TProcessedMedia } from '../types'
import { createBlurDataURL } from '../utils/createBlurDataURL'
import { createMediaHashFromPath } from '../utils/createMediaHash'

export class ImageProcessor {
    constructor(private storage: LocalMediaStorage) {}

    async process(buffer: Buffer): Promise<TProcessedMedia> {
        try {
            return await this.processToWebp(buffer)
        } catch {
            return await this.processToJpeg(buffer)
        }
    }

    private async processToWebp(buffer: Buffer): Promise<TProcessedMedia> {
        const output = await this.storage.createOutputFile('images', 'webp')

        try {
            await sharp(buffer, { limitInputPixels: MEDIA_LIMITS.maxInputPixels })
                .rotate()
                .resize({
                    width: MEDIA_LIMITS.maxOutputDimensionPx,
                    height: MEDIA_LIMITS.maxOutputDimensionPx,
                    fit: 'inside',
                    withoutEnlargement: true
                })
                .webp({ quality: 84, effort: 4 })
                .toFile(output.absolutePath)

            return await this.buildImageArtifact(output.absolutePath, output.publicPath, 'webp')
        } catch (error) {
            await this.storage.removeFile(output.absolutePath)
            throw error
        }
    }

    private async processToJpeg(buffer: Buffer): Promise<TProcessedMedia> {
        const output = await this.storage.createOutputFile('images', 'jpeg')

        try {
            await sharp(buffer, { limitInputPixels: MEDIA_LIMITS.maxInputPixels })
                .rotate()
                .resize({
                    width: MEDIA_LIMITS.maxOutputDimensionPx,
                    height: MEDIA_LIMITS.maxOutputDimensionPx,
                    fit: 'inside',
                    withoutEnlargement: true
                })
                .jpeg({ quality: 88, mozjpeg: true })
                .toFile(output.absolutePath)

            return await this.buildImageArtifact(output.absolutePath, output.publicPath, 'jpeg')
        } catch {
            await this.storage.removeFile(output.absolutePath)
            throw ApiError.BadRequest(ERROR_MESSAGES.MEDIA.PROCESSING_ERROR)
        }
    }

    private async buildImageArtifact(
        filePath: string,
        publicPath: string,
        format: 'webp' | 'jpeg'
    ): Promise<TProcessedMedia> {
        const metadata = await sharp(filePath).metadata()
        const width = metadata.width
        const height = metadata.height

        if (!width || !height) {
            await this.storage.removeFile(filePath)
            throw ApiError.BadRequest(ERROR_MESSAGES.MEDIA.NO_RESOLUTION)
        }

        if (width < MEDIA_LIMITS.minWidthPx || height < MEDIA_LIMITS.minHeightPx) {
            await this.storage.removeFile(filePath)
            throw ApiError.BadRequest(ERROR_MESSAGES.MEDIA.DIMENSION_TOO_SMALL)
        }

        const size = await this.storage.getFileSize(filePath)
        const blurDataURL = await createBlurDataURL(filePath)
        const processed_hash = await createMediaHashFromPath(filePath)

        return {
            media: {
                src: publicPath,
                type: 'image',
                format,
                blurDataURL,
                width,
                height,
                size,
                thumbnail: null,
                duration: null,
                processed_hash
            },
            cleanup: async () => {
                await this.storage.removeFile(filePath)
            }
        }
    }
}
