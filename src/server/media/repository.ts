import { Prisma } from '@prisma/client'
import { Media, mediaSelect, prisma, User } from '@/shared/services/prisma'
import { TMediaSelect } from '@/shared/types/media.types'
import { IMediaRepository } from './types'

const CONTEXT_LOCK_SEED: Record<Media['context'], number> = {
    DEFAULT: 0x11,
    AVATAR: 0x22,
    COVER: 0x33
}

const toSignedInt32 = (value: number): number => {
    const unsigned = value >>> 0
    return unsigned > 0x7fffffff ? unsigned - 0x100000000 : unsigned
}

const createAdvisoryLockKeys = (hash: string, context: Media['context']): [number, number] => {
    const first = Number.parseInt(hash.slice(0, 8), 16)
    const second = Number.parseInt(hash.slice(8, 16), 16) ^ CONTEXT_LOCK_SEED[context]
    return [toSignedInt32(first), toSignedInt32(second)]
}

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

    async findById(id: Media['id']): Promise<TMediaSelect | null> {
        return await prisma.media.findUnique({
            where: { id },
            select: mediaSelect
        })
    }

    async linkMediaToUser(mediaId: Media['id'], userId: User['id']): Promise<void> {
        await prisma.userMediaUpload.upsert({
            where: { userId_mediaId: { mediaId, userId } },
            update: {},
            create: { mediaId, userId }
        })
    }

    async createOrGetByOriginalHash(input: {
        userId: User['id']
        originalHash: Media['original_hash']
        context: Media['context']
        media: Omit<Media, 'id' | 'original_hash' | 'context'>
    }): Promise<{ media: TMediaSelect; status: number; created: boolean }> {
        return await prisma.$transaction(
            async (tx) => {
                // Зачем это нужно: чтобы две параллельные загрузки одного и того же файла (в том же контексте) не сделали двойной create. То есть это сериализует только конфликтующие операции, а разные файлы/контексты продолжают обрабатываться параллельно.
                const [lockA, lockB] = createAdvisoryLockKeys(input.originalHash, input.context)
                await tx.$executeRaw`SELECT pg_advisory_xact_lock(${lockA}::int4, ${lockB}::int4)`

                const existing = await tx.media.findFirst({
                    where: {
                        OR: [
                            { original_hash: input.originalHash, context: input.context },
                            { processed_hash: input.originalHash, context: input.context }
                        ]
                    },
                    select: mediaSelect
                })

                if (existing) {
                    await tx.userMediaUpload.upsert({
                        where: { userId_mediaId: { mediaId: existing.id, userId: input.userId } },
                        update: {},
                        create: { mediaId: existing.id, userId: input.userId }
                    })

                    return { media: existing, status: 200, created: false }
                }

                const created = await tx.media.create({
                    data: {
                        ...input.media,
                        original_hash: input.originalHash,
                        context: input.context,
                        uploads: { create: [{ userId: input.userId }] }
                    },
                    select: mediaSelect
                })

                return { media: created, status: 201, created: true }
            },
            { isolationLevel: Prisma.TransactionIsolationLevel.Serializable }
        )
    }
}
