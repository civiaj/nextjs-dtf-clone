import { ApiError } from '@/lib/error'
import { ICommentRepository } from '@/server/comment/types'
import { ERROR_MESSAGES } from '@/shared/constants'
import { commentSelect, Post, Prisma, prisma, User } from '@/shared/services/prisma'
import { TCommentData } from '@/shared/types/comment.types'
import { TPost, TPostCommentMetrics } from '@/shared/types/post.types'
import { TUser } from '@/shared/types/user.types'
import {
    CreateCommentDTO,
    DeleteCommentDTO,
    GetPostCommentsDTO,
    GetPostThreadDTO,
    GetUserCommentsDTO
} from '@/shared/validation/comment.schema'

export class CommentRepository implements ICommentRepository {
    async createOne(dto: CreateCommentDTO, userId: TUser['id']) {
        return prisma.$transaction(async (tx) => {
            const post = await tx.post.findUnique({
                where: { id: dto.postId, status: 'PUBLISHED' },
                select: { user: { select: { id: true } } }
            })

            if (!post) {
                throw ApiError.BadRequest(ERROR_MESSAGES.POST.NOT_FOUND)
            }

            const [media, parent, mute] = await Promise.all([
                dto.mediaId
                    ? tx.media.findUnique({
                          where: { id: dto.mediaId },
                          select: { id: true }
                      })
                    : Promise.resolve(null),
                dto.parentId
                    ? tx.comment.findUnique({
                          where: { id: dto.parentId, postId: dto.postId },
                          select: { path: true }
                      })
                    : Promise.resolve(null),
                tx.muteUser.findUnique({
                    where: {
                        ownerId_targetUserId: {
                            ownerId: post.user.id,
                            targetUserId: userId
                        }
                    }
                })
            ])

            if (dto.mediaId && !media) {
                throw ApiError.BadRequest(ERROR_MESSAGES.MEDIA.NOT_FOUND)
            }

            if (mute) {
                throw ApiError.BadRequest(ERROR_MESSAGES.MUTE.IS_MUTED)
            }

            let parentPath: string | null = null
            let parentIds: number[] = []

            if (dto.parentId) {
                if (!parent || !parent.path) {
                    throw ApiError.BadRequest(ERROR_MESSAGES.COMMENT.NOT_FOUND)
                }

                parentPath = parent.path
                parentIds = parent.path.split('/').map(Number)
            }

            const comment = await tx.comment.create({
                data: {
                    ...dto,
                    userId,
                    json: dto.json ?? Prisma.JsonNull
                },
                select: { id: true }
            })

            const path = parentPath ? `${parentPath}/${comment.id}` : String(comment.id)
            const updatedComment = await tx.comment.update({
                where: { id: comment.id },
                data: { path },
                select: commentSelect
            })

            if (parentIds.length) {
                await tx.comment.updateMany({
                    where: { id: { in: parentIds } },
                    data: { replyCount: { increment: 1 } }
                })
            }

            return updatedComment
        }) as Promise<TCommentData>
    }

    async findPostCommentsWithReplies({
        postId,
        cursor,
        parentId = null,
        sortBy: _
    }: GetPostCommentsDTO) {
        const rootLimit = 10
        const repliesLimit = 4

        const orderBy:
            | Prisma.CommentOrderByWithRelationInput
            | Prisma.CommentOrderByWithRelationInput[] = [{ createdAt: 'desc' }, { id: 'desc' }]

        const rootsResult = await prisma.comment.findMany({
            where: { postId, parentId },
            orderBy,
            cursor: cursor ? { id: cursor } : undefined,
            skip: cursor ? 1 : 0,
            take: rootLimit + 1,
            select: commentSelect
        })

        const hasNextPage = rootsResult.length > rootLimit
        const roots = rootsResult.slice(0, rootLimit)
        const rootIds = roots.map((r) => r.id)
        const repliesCursorByParent: Record<string, number> = {}

        const repliesByRoot = await Promise.all(
            rootIds.map((id) =>
                prisma.comment.findMany({
                    where: { parentId: id },
                    orderBy,
                    take: repliesLimit + 1,
                    select: commentSelect
                })
            )
        )

        const replies = repliesByRoot
            .map((items, index) => {
                const rootId = rootIds[index]
                const hasNextReplies = items.length > repliesLimit
                const visibleReplies = items.slice(0, repliesLimit)

                if (hasNextReplies && visibleReplies.length > 0) {
                    repliesCursorByParent[rootId] = visibleReplies[visibleReplies.length - 1].id
                }

                return visibleReplies
            })
            .flat()

        const repliesByParent = new Map()

        for (const reply of replies) {
            const list = repliesByParent.get(reply.parentId!) ?? []
            list.push(reply)
            repliesByParent.set(reply.parentId!, list)
        }

        const items = []

        for (const root of roots) {
            items.push(root)

            const r = repliesByParent.get(root.id)
            if (!r) continue

            for (const reply of r) {
                items.push(reply)
            }
        }

        return {
            items: items as TCommentData[],
            cursor: hasNextPage ? roots[roots.length - 1].id : null,
            repliesCursorByParent
        }
    }

    async findThread({ threadId, postId }: GetPostThreadDTO) {
        const target = await prisma.comment.findUnique({
            where: { id: threadId, postId },
            select: { ...commentSelect, path: true }
        })

        if (!target || !target.path) {
            throw ApiError.BadRequest(ERROR_MESSAGES.COMMENT.NOT_FOUND)
        }

        const pathIds = target.path.split('/').map(Number)
        const rootId = pathIds[0]
        const ancestorIds = pathIds.slice(0, -1)

        const comments = await prisma.comment.findMany({
            where: {
                postId,
                OR: [{ id: rootId }, { parentId: { in: ancestorIds } }]
            },
            orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
            select: commentSelect
        })

        return comments as TCommentData[]
    }

    async getByIds(ids: number[]) {
        return (await prisma.comment.findMany({
            where: { id: { in: ids } },
            select: commentSelect
        })) as TCommentData[]
    }

    async findUserComments({ userId, cursor, sortBy: _ }: GetUserCommentsDTO) {
        const limit = 10
        const comments = await prisma.comment.findMany({
            where: { userId },
            orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
            cursor: cursor ? { id: cursor } : undefined,
            skip: cursor ? 1 : 0,
            take: limit + 1,
            select: commentSelect
        })

        const hasNextPage = comments.length > limit
        const items = comments.slice(0, limit) as TCommentData[]

        return { items, cursor: hasNextPage ? items[items.length - 1].id : null }
    }

    async softDeleteOne({ id }: DeleteCommentDTO, userId: User['id']) {
        return prisma.$transaction(async (tx) => {
            const existed = await tx.comment.findUnique({
                where: { id },
                select: { userId: true, parentId: true, isDeleted: true }
            })

            if (!existed) {
                throw ApiError.BadRequest(ERROR_MESSAGES.COMMENT.NOT_FOUND)
            }

            const user = await tx.user.findUnique({ where: { id: userId }, select: { role: true } })
            const canDelete = user?.role === 'ADMIN' || existed.userId === userId

            if (!canDelete) {
                throw ApiError.BadRequest(ERROR_MESSAGES.COMMENT.NOT_ENOUGH_RIGHTS)
            }

            const update = await tx.comment.updateMany({
                where: { id, isDeleted: false },
                data: { isDeleted: true, json: Prisma.JsonNull, mediaId: null }
            })

            if (update.count === 0) {
                throw ApiError.BadRequest(ERROR_MESSAGES.COMMENT.ALREADY_DELETED)
            }

            return tx.comment.findUnique({
                where: { id },
                select: commentSelect
            })
        }) as Promise<TCommentData>
    }

    async getMetrics({ ids }: { ids: Post['id'][] }) {
        const map = new Map<TPost['id'], TPostCommentMetrics>()
        ids.forEach((id) => map.set(id, this.getDefaultMetrics()))

        if (!ids.length) return map

        const counts = await prisma.comment.groupBy({
            by: ['postId'],
            where: { postId: { in: ids } },
            _count: true
        })

        counts.forEach((c) => map.set(c.postId, { commentCount: c._count }))
        return map
    }

    getDefaultMetrics(): TPostCommentMetrics {
        return { commentCount: 0 }
    }

    async deletePostComments(postId: Post['id']) {
        await prisma.comment.deleteMany({ where: { postId } })
    }
}
