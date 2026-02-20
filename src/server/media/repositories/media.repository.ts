import { Media, mediaSelect, prisma, User } from '@/shared/services/prisma'
import { IMediaRepository } from '../types'

export class MediaRepository implements IMediaRepository {
    async findByHash(
        hash: Media['original_hash'] | Media['processed_hash'],
        context: Media['context']
    ) {
        return await prisma.media.findFirst({
            where: {
                OR: [
                    { original_hash: hash, context },
                    { processed_hash: hash, context }
                ]
            },
            select: mediaSelect
        })
    }

    async findById(id: Media['id']) {
        return await prisma.media.findUnique({
            where: { id },
            select: mediaSelect
        })
    }

    async create(data: Omit<Media, 'id'>, userId: User['id']) {
        return await prisma.media.create({
            data: { ...data, uploads: { create: [{ userId }] } },
            select: mediaSelect
        })
    }

    async linkMediaToUser(mediaId: Media['id'], userId: User['id']) {
        await prisma.userMediaUpload.upsert({
            where: { userId_mediaId: { mediaId, userId } },
            update: {},
            create: { mediaId, userId }
        })
    }
}
