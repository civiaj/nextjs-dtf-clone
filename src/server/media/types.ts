import { Media, User } from '@/shared/services/prisma'
import {
    TMedia,
    TMediaFormatImage,
    TMediaFormatVideo,
    TMediaSelect
} from '@/shared/types/media.types'
import { MediaUploadSchemaInput } from '@/shared/validation/media/mediaSchema'

export interface IMediaFileRepository {
    saveAnimatedWebp(buffer: Buffer): Promise<Omit<Media, 'id' | 'original_hash' | 'context'>>
    saveImage(
        buffer: Buffer,
        format: TMediaFormatImage
    ): Promise<Omit<Media, 'id' | 'original_hash' | 'context'>>
    saveVideo(
        buffer: Buffer,
        format: TMediaFormatVideo
    ): Promise<Omit<Media, 'id' | 'original_hash' | 'context'>>
}

export interface IMediaRepository {
    findByHash(
        hash: Media['original_hash'] | Media['processed_hash'],
        context: Media['context']
    ): Promise<TMediaSelect | null>
    findById(id: Media['id']): Promise<TMediaSelect | null>
    create(data: Omit<Media, 'id'>, userId: User['id']): Promise<TMediaSelect>
    linkMediaToUser(mediaId: Media['id'], userId: User['id']): Promise<void>
}

export interface IMediaService {
    upload(
        userId: User['id'],
        file: MediaUploadSchemaInput['file']
    ): Promise<{ result: TMedia; status: number }>
    findById(id: Media['id']): Promise<TMediaSelect | null>
}
