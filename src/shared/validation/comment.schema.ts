import { z } from 'zod'
import { commentDocumentHandler } from '@/server/comment/utils'

export const POST_COMMENTS_SORT = ['new', 'hotness'] as const
export const USER_COMMENTS_SORT = ['new', 'hotness', 'month', 'year', 'all'] as const

const idParam = z.preprocess((val) => {
    if (typeof val === 'string') return Number(val)
    return val
}, z.number().int().positive().max(Number.MAX_SAFE_INTEGER))

export const getUserCommentsSchema = z
    .object({
        type: z.literal('user'),
        userId: idParam,
        sortBy: z.enum(USER_COMMENTS_SORT),
        cursor: idParam.optional()
    })
    .strict()

export const getPostCommentsSchema = z
    .object({
        type: z.literal('post'),
        postId: idParam,
        sortBy: z.enum(POST_COMMENTS_SORT),
        cursor: idParam.optional(),
        parentId: idParam.nullable().optional()
    })
    .strict()

export const getPostThreadSchema = z
    .object({
        type: z.literal('thread'),
        threadId: idParam,
        postId: idParam
    })
    .strict()

export const getBookmarkedCommentsSchema = z
    .object({
        type: z.literal('bookmarks'),
        cursor: idParam.optional()
    })
    .strict()

export const getReactedCommentsSchema = z
    .object({
        type: z.literal('reactions'),
        cursor: idParam.optional()
    })
    .strict()

export const getCommentsSchema = z.discriminatedUnion('type', [
    getUserCommentsSchema,
    getPostCommentsSchema,
    getPostThreadSchema,
    getBookmarkedCommentsSchema,
    getReactedCommentsSchema
])

export const createCommentInputSchema = z
    .object({
        postId: z.number().int().positive().max(Number.MAX_SAFE_INTEGER),
        json: z.string().nullable().optional(),
        mediaId: z.number().int().positive().max(Number.MAX_SAFE_INTEGER).nullable().optional(),
        parentId: z.number().int().positive().max(Number.MAX_SAFE_INTEGER).nullable().optional()
    })
    .strict()

export const createCommentSchema = createCommentInputSchema
    .transform((data) => {
        const json = commentDocumentHandler.transform(data.json)
        return { ...data, json }
    })
    .refine((data) => data.json || typeof data.mediaId !== 'undefined', {
        message: 'Комментарий должен содержать текст или файл'
    })

export const deleteCommentSchema = z
    .object({
        id: z.number().positive().max(Number.MAX_SAFE_INTEGER)
    })
    .strict()

export const createTestCommentsSchema = z
    .object({
        postId: z.string().transform((val) => parseInt(val, 10)),
        userId: z.string().transform((val) => parseInt(val, 10))
    })
    .strict()

export type PostCommentsSort = (typeof POST_COMMENTS_SORT)[number]
export type UserCommentsSort = (typeof USER_COMMENTS_SORT)[number]

export type CreateCommentInput = z.infer<typeof createCommentInputSchema>
export type CreateCommentDTO = z.infer<typeof createCommentSchema>

export type GetPostCommentsInput = z.infer<typeof getPostCommentsSchema>
export type GetPostCommentsDTO = GetPostCommentsInput

export type GetPostThreadInput = z.infer<typeof getPostThreadSchema>
export type GetPostThreadDTO = GetPostThreadInput

export type GetUserCommentsDTO = z.infer<typeof getUserCommentsSchema>
export type GetUserCommentsInput = GetUserCommentsDTO

export type GetBookmarkedCommentsInput = z.infer<typeof getBookmarkedCommentsSchema>
export type GetBookmarkedCommentsDTO = GetBookmarkedCommentsInput

export type GetReactedCommentsInput = z.infer<typeof getReactedCommentsSchema>
export type GetReactedCommentsDTO = GetReactedCommentsInput

export type GetCommentsInput = z.infer<typeof getCommentsSchema>
export type GetCommentsDTO = GetCommentsInput

export type DeleteCommentInput = z.infer<typeof deleteCommentSchema>
export type DeleteCommentDTO = DeleteCommentInput

export type CreateTestCommentsDTO = z.infer<typeof createTestCommentsSchema>
