import { z } from 'zod'
import { idParam } from '@/shared/validation/common.schema'
import { editorSchema, editorSchemaTransformed } from '@/shared/validation/editor/editor.validation'

export const POST_MAIN_FEED_SORT = ['hotness', 'day', 'week', 'month', 'year', 'all'] as const
export const POST_RECENT_CONTENT_SORT = ['latest', 'latest-5', 'latest-10'] as const
export const POST_OWNER_CONTENT_SORT = ['new', 'popular'] as const
export const USER_POSTS_SORT = ['new', 'hotness', 'month', 'year', 'all'] as const
export const POST_FEED_SORT_VARIANTS = [
    ...POST_MAIN_FEED_SORT,
    ...POST_RECENT_CONTENT_SORT,
    ...POST_OWNER_CONTENT_SORT
] as const

export const getPostSchema = z
    .object({
        id: idParam.optional(),
        slug: z.string().optional()
    })
    .refine((data) => data.id || data.slug, {
        message: 'id или slug обязательны'
    })

export const getFeedPostsSchema = z.object({
    type: z.literal('feed'),
    cursor: idParam.optional(),
    sortBy: z.enum(POST_FEED_SORT_VARIANTS)
})

export const getUserPostsSchema = z.object({
    type: z.literal('users'),
    cursor: idParam.optional(),
    sortBy: z.enum(USER_POSTS_SORT),
    userId: idParam
})

export const getOwnerDraftsSchema = z.object({
    type: z.literal('owner-drats'),
    cursor: idParam.optional()
})

export const getOwnerBookmaredPostsSchema = z.object({
    type: z.literal('owner-bookmarks'),
    cursor: idParam.optional()
})

export const getOwnerReactedPostsSchema = z.object({
    type: z.literal('owner-reactions'),
    cursor: idParam.optional()
})

export const geOwnerMutedPostsSchema = z.object({
    type: z.literal('owner-muted-posts'),
    cursor: idParam.optional()
})

export const getPostsSchema = z.discriminatedUnion('type', [
    getFeedPostsSchema,
    getUserPostsSchema,
    getOwnerDraftsSchema,
    getOwnerBookmaredPostsSchema,
    getOwnerReactedPostsSchema,
    geOwnerMutedPostsSchema
])

export const publishPostSchema = z.object({
    id: idParam
})

export const deletePostSchema = z.object({
    id: idParam
})

const updatePostSchemaBase = z.object({
    id: z.number().int().min(0).max(Number.MAX_SAFE_INTEGER)
})

export const updatePostSchemaInput = updatePostSchemaBase.extend({
    data: editorSchema
})

export const updatePostSchema = updatePostSchemaBase.extend({
    data: editorSchemaTransformed
})

export type PostMainFeedSort = (typeof POST_MAIN_FEED_SORT)[number]
export type PostRecentContentSort = (typeof POST_RECENT_CONTENT_SORT)[number]
export type PostOwnerContentSort = (typeof POST_OWNER_CONTENT_SORT)[number]
export type PostFeedSortVariants = (typeof POST_FEED_SORT_VARIANTS)[number]
export type UserPostsSort = (typeof USER_POSTS_SORT)[number]

export type GetPostInput = z.infer<typeof getPostSchema>
export type GetPostDTO = GetPostInput

export type GetFeedPostsInput = z.infer<typeof getFeedPostsSchema>
export type GetFeedPostsDTO = GetFeedPostsInput

export type GetUserPostsInput = z.infer<typeof getUserPostsSchema>
export type GetUserPostsDTO = GetUserPostsInput

export type GetOwnerDraftsInput = z.infer<typeof getOwnerDraftsSchema>
export type GetOwnerDraftsDTO = GetOwnerDraftsInput

export type GetOwnerBookmaredPostsInput = z.infer<typeof getOwnerBookmaredPostsSchema>
export type GetOwnerBookmaredPostsDTO = GetOwnerBookmaredPostsInput

export type GetOwnerReactedPostsInput = z.infer<typeof getOwnerReactedPostsSchema>
export type GetOwnerReactedPostsDTO = GetOwnerReactedPostsInput

export type GetOwnerMutedPostsInput = z.infer<typeof geOwnerMutedPostsSchema>
export type GetOwnerMutedPostsDTO = GetOwnerMutedPostsInput

export type GetPostsInput = z.infer<typeof getPostsSchema>
export type GetPostsDTO = GetPostsInput

export type PublishPostInput = z.infer<typeof publishPostSchema>
export type PublishPostDTO = PublishPostInput

export type DeletePostInput = z.infer<typeof deletePostSchema>
export type DeletePostDTO = DeletePostInput

export type UpdatePostInput = z.infer<typeof updatePostSchemaInput>
export type UpdatePostDTO = z.infer<typeof updatePostSchema>
