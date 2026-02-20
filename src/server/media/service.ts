import { fileTypeFromBuffer } from 'file-type'
import { ApiError } from '@/lib/error'
import { IMediaFileRepository, IMediaRepository, IMediaService } from '@/server/media/types'
import { ERROR_MESSAGES, SUPPORTED_FILE_EXTENTIONS } from '@/shared/constants'
import { Media, User } from '@/shared/services/prisma'
import { MediaUploadSchemaInput } from '@/shared/validation/media/mediaSchema'
import { createMediaHashFromBuffer } from './utils/createMediaHash'

export class MediaService implements IMediaService {
    constructor(
        private mediaFileRepository: IMediaFileRepository,
        private mediaRepository: IMediaRepository
    ) {}
    async upload(
        userId: User['id'],
        file: MediaUploadSchemaInput['file'],
        options?: MediaUploadSchemaInput['options']
    ) {
        const buffer = Buffer.from(await file.arrayBuffer())
        const original_hash = createMediaHashFromBuffer(buffer)
        const fileType = await fileTypeFromBuffer(buffer)

        if (!fileType) throw ApiError.BadRequest(ERROR_MESSAGES.MEDIA.WRONG_FORMAT('unknown'))

        const { ext } = fileType
        let context: Media['context'] = 'DEFAULT'
        const isAvatar = options?.isAvatar === true
        const isCover = options?.isCover === true

        if (isAvatar) context = 'AVATAR'
        else if (isCover) context = 'COVER'

        let media = await this.mediaRepository.findByHash(original_hash, context)
        let status = 200

        if (!media) {
            let data: Omit<Media, 'id' | 'original_hash' | 'context'> | null = null

            data = await this.resolveMediaProcessing(ext, buffer, options)
            if (!data) throw ApiError.BadRequest(ERROR_MESSAGES.MEDIA.WRONG_FORMAT(ext))

            media = await this.mediaRepository.create({ ...data, original_hash, context }, userId)
            status = 201
        }

        await this.mediaRepository.linkMediaToUser(media.id, userId)
        return { result: media, status }
    }

    private async resolveMediaProcessing(
        ext: string | (typeof SUPPORTED_FILE_EXTENTIONS)[number],
        buffer: Buffer,
        options?: MediaUploadSchemaInput['options']
    ) {
        const isVideo = ['gif', 'mp4', 'mkv', 'mov', 'avi', 'webm'].includes(ext)

        if (isVideo && options) {
            return await this.mediaFileRepository.saveAnimatedWebp(buffer)
        }

        switch (ext) {
            case 'jpg':
            case 'webp':
            case 'jpeg':
            case 'png':
            case 'heic':
            case 'heif':
            case 'tiff':
            case 'bmp':
                return await this.mediaFileRepository.saveImage(buffer, 'webp')

            case 'gif':
                return await this.mediaFileRepository.saveVideo(buffer, 'gif')

            case 'mp4':
            case 'mkv':
            case 'mov':
            case 'avi':
            case 'webm':
                return await this.mediaFileRepository.saveVideo(buffer, 'mp4')

            default:
                return null
        }
    }

    async findById(id: Media['id']) {
        return this.mediaRepository.findById(id)
    }
}
