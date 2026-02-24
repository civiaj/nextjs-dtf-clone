import { Media, User } from '@/shared/services/prisma'
import { TMediaSelect } from '@/shared/types/media.types'

export type TDetectedMediaKind = 'image' | 'video'

export type TDetectedFile = {
    buffer: Buffer
    detectedMime: string
    detectedExtension: string
    kind: TDetectedMediaKind
}

export type TProcessedMedia = {
    media: Omit<Media, 'id' | 'original_hash' | 'context'>
    cleanup: () => Promise<void>
}

export interface IMediaRepository {
    findByHash(
        hash: Media['original_hash'] | Media['processed_hash'],
        context: Media['context']
    ): Promise<TMediaSelect | null>
    findById(id: Media['id']): Promise<TMediaSelect | null>
    createOrGetByOriginalHash(input: {
        userId: User['id']
        originalHash: Media['original_hash']
        context: Media['context']
        media: Omit<Media, 'id' | 'original_hash' | 'context'>
    }): Promise<{ media: TMediaSelect; status: number; created: boolean }>
    linkMediaToUser(mediaId: Media['id'], userId: User['id']): Promise<void>
}
