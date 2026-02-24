import { Media, User } from '@/shared/services/prisma'
import { TMediaSelect } from '@/shared/types/media.types'
import { UploadMediaDTO } from '@/shared/validation/media.validation'
import { ImageProcessor } from './processors/image.processor'
import { VideoProcessor } from './processors/video.processor'
import { IMediaRepository } from './types'
import { createMediaHashFromBuffer } from './utils/createMediaHash'
import { detectAndValidateFile } from './utils/detectAndValidateFile'
import { resolveMediaContext } from './utils/resolveMediaContext'

export class MediaService {
    constructor(
        private mediaRepository: IMediaRepository,
        private imageProcessor: ImageProcessor,
        private videoProcessor: VideoProcessor
    ) {}

    async upload({ file, options }: UploadMediaDTO, userId: User['id']) {
        const context = resolveMediaContext(options)
        const detected = await detectAndValidateFile(file)
        const originalHash = createMediaHashFromBuffer(detected.buffer)

        const existing = await this.mediaRepository.findByHash(originalHash, context)

        if (existing) {
            await this.mediaRepository.linkMediaToUser(existing.id, userId)
            return { result: existing, status: 200 }
        }

        const processedMedia =
            detected.kind === 'image'
                ? await this.imageProcessor.process(detected.buffer)
                : await this.videoProcessor.process(
                      detected.buffer,
                      detected.detectedExtension,
                      options
                  )

        const cleanupProcessedMediaSafely = async () => {
            try {
                await processedMedia.cleanup()
            } catch (cleanupError) {
                console.warn('media artifact cleanup failed', cleanupError)
            }
        }

        try {
            const upserted = await this.mediaRepository.createOrGetByOriginalHash({
                userId,
                originalHash,
                context,
                media: processedMedia.media
            })

            if (!upserted.created) {
                await cleanupProcessedMediaSafely()
            }

            return { result: upserted.media, status: upserted.status }
        } catch (error) {
            await cleanupProcessedMediaSafely()
            throw error
        }
    }

    async findById(id: Media['id']): Promise<TMediaSelect | null> {
        return await this.mediaRepository.findById(id)
    }
}
