import { slug as slugger } from 'github-slugger'
import { NEW_DRAFT_ID } from '@/entities/post'
import { ApiError } from '@/lib/error'
import { ERROR_MESSAGES } from '@/shared/constants'
import { Post, postSelect, Prisma, prisma, User } from '@/shared/services/prisma'
import { TPostData, TPostSelect } from '@/shared/types/post.types'
import {
    DeletePostDTO,
    GetFeedPostsDTO,
    GetOwnerDraftsDTO,
    GetUserPostsDTO,
    PublishPostDTO,
    UpdatePostDTO
} from '@/shared/validation/post.schema'
import { IPostRepository } from './types'
import { applyFeedSort, applyUserPostsSort } from './utils/applySort'
import { transformPost } from './utils/transformPost'

export class PostRepository implements IPostRepository {
    async getById(id: Post['id']) {
        const post = await prisma.post.findUnique({
            where: { id, status: { in: ['PUBLISHED', 'DRAFT'] } },
            select: postSelect
        })

        return transformPost(post)
    }

    async getBySlug(slug: Post['slug']) {
        const post = await prisma.post.findUnique({
            where: { slug, status: { in: ['PUBLISHED', 'DRAFT'] } },
            select: postSelect
        })

        return transformPost(post)
    }

    async getByIds(ids: Post['id'][]): Promise<TPostData[]> {
        const posts = await prisma.post.findMany({
            where: { id: { in: ids }, status: { in: ['PUBLISHED'] } },
            select: postSelect
        })

        return posts.map(transformPost).filter(Boolean) as TPostData[]
    }

    async getFeedPosts({ sortBy, cursor }: GetFeedPostsDTO, userId?: User['id']) {
        const limit = 10
        const where: Prisma.PostWhereInput = {
            status: 'PUBLISHED',
            publishedAt: { not: null }
        }

        if (userId) {
            where.NOT = {
                OR: [
                    { user: { mutedByUsers: { some: { ownerId: userId } } } },
                    { mutedByUsers: { some: { ownerId: userId } } }
                ]
            }
        }

        const now = new Date()
        const orderBy = applyFeedSort({ where, sortBy, userId, now })

        const posts = await prisma.post.findMany({
            where,
            orderBy,
            take: limit + 1,
            skip: cursor ? 1 : 0,
            select: postSelect,
            cursor: cursor ? { id: cursor } : undefined
        })

        const hasNextPage = posts.length > limit
        const items = posts.slice(0, limit) as TPostData[]

        return {
            items: items.map(transformPost).filter(Boolean) as TPostData[],
            cursor: hasNextPage ? items[items.length - 1].id : null
        }
    }

    async getUserPosts({ sortBy, userId, cursor }: GetUserPostsDTO) {
        const limit = 10
        const where: Prisma.PostWhereInput = { status: 'PUBLISHED', userId }
        const now = new Date()
        const orderBy = applyUserPostsSort({ where, sortBy, now })

        const posts = await prisma.post.findMany({
            where,
            orderBy,
            take: limit + 1,
            skip: cursor ? 1 : 0,
            select: postSelect,
            cursor: cursor ? { id: cursor } : undefined
        })

        const hasNextPage = posts.length > limit
        const items = posts.slice(0, limit)

        return {
            items: items.map(transformPost).filter(Boolean) as TPostData[],
            cursor: hasNextPage ? items[items.length - 1].id : null
        }
    }

    async getOwnerDrafts({ cursor }: GetOwnerDraftsDTO, userId: User['id']) {
        const limit = 10
        const posts = await prisma.post.findMany({
            where: { status: 'DRAFT', userId },
            orderBy: [{ updatedAt: 'desc' }, { id: 'desc' }],
            cursor: cursor ? { id: cursor } : undefined,
            skip: cursor ? 1 : 0,
            take: limit + 1,
            select: postSelect
        })

        const hasNextPage = posts.length > limit
        const items = posts.slice(0, limit)

        return {
            items: items.map(transformPost).filter(Boolean) as TPostData[],
            cursor: hasNextPage ? items[items.length - 1].id : null
        }
    }

    async publish({ id }: PublishPostDTO, userId: User['id']) {
        const now = new Date()
        const post = await prisma.post.update({
            where: { id, userId, status: 'DRAFT' },
            data: { status: 'PUBLISHED', publishedAt: now, lastEditedAt: now },
            select: postSelect
        })

        return transformPost(post)
    }

    async updateOne({ data: blocks, id }: UpdatePostDTO, userId: User['id']) {
        return await prisma.$transaction(async (tx) => {
            let activePost: null | TPostSelect = null

            if (id === NEW_DRAFT_ID) {
                activePost = await tx.post.create({
                    data: { userId, status: 'DRAFT', slug: '' },
                    select: postSelect
                })
            } else {
                activePost = await tx.post.findUnique({
                    where: { id, status: { in: ['PUBLISHED', 'DRAFT'] } },
                    select: postSelect
                })
            }

            if (!activePost) {
                throw ApiError.BadRequest(ERROR_MESSAGES.POST.NOT_FOUND)
            }

            const activePostId = activePost.id
            let slug: string | null = null
            const title = blocks[0].type === 'heading' ? blocks[0].data.text : null

            if (title) {
                const sluggerSlug = slugger(userId + ' ' + title)
                slug = sluggerSlug
                let count = 1

                while (true) {
                    const exist = await tx.post.findFirst({
                        where: { slug, NOT: { id: activePost.id } }
                    })
                    if (!exist) break

                    slug = `${sluggerSlug}-${count}`
                    count += 1
                }
            } else {
                slug = String(activePost.id)
            }

            const [_, post] = await Promise.all([
                tx.blocks.deleteMany({ where: { postId: activePostId, userId } }),
                tx.post.update({
                    where: { id: activePostId, userId, status: { in: ['DRAFT', 'PUBLISHED'] } },
                    data: {
                        title,
                        slug,
                        lastEditedAt: activePost.status === 'PUBLISHED' ? new Date() : undefined,
                        blocks: { create: { userId, data: blocks } }
                    },
                    select: postSelect
                })
            ])

            return transformPost(post) as TPostData
        })
    }

    async deleteOne({ id }: DeletePostDTO, userId: User['id']) {
        return await prisma.$transaction(async (tx) => {
            const [post, user] = await Promise.all([
                tx.post.findFirst({
                    where: { id, status: { in: ['DRAFT', 'PUBLISHED'] } },
                    select: postSelect
                }),
                tx.user.findUnique({ where: { id: userId }, select: { role: true, id: true } })
            ])

            if (!post) {
                throw ApiError.BadRequest(ERROR_MESSAGES.POST.NOT_FOUND)
            }

            const canDelete = user?.role === 'ADMIN' || post.user.id === userId

            if (!canDelete) {
                throw ApiError.BadRequest(ERROR_MESSAGES.POST.NOT_ENOUGH_RIGHTS)
            }

            const [_, update] = await Promise.all([
                tx.blocks.deleteMany({ where: { postId: id, userId } }),
                tx.post.delete({
                    where: { id, userId },
                    select: postSelect
                })
            ])

            return transformPost(update) as TPostData
        })
    }

    async softDeleteOne({ id }: DeletePostDTO, userId: User['id']) {
        return await prisma.$transaction(async (tx) => {
            const [post, user] = await Promise.all([
                tx.post.findFirst({
                    where: { id, status: { in: ['DRAFT', 'PUBLISHED'] } },
                    select: postSelect
                }),
                tx.user.findUnique({ where: { id: userId }, select: { role: true, id: true } })
            ])

            if (!post) {
                throw ApiError.BadRequest(ERROR_MESSAGES.POST.NOT_FOUND)
            }

            const canDelete = user?.role === 'ADMIN' || post.user.id === userId

            if (!canDelete) {
                throw ApiError.BadRequest(ERROR_MESSAGES.POST.NOT_ENOUGH_RIGHTS)
            }

            const update = await prisma.post.update({
                where: { id, userId },
                data: { status: 'DELETED' },
                select: postSelect
            })

            return transformPost(update) as TPostData
        })
    }
}
