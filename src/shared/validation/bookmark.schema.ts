import { z } from 'zod'
import { idParam } from '@/shared/validation/common.schema'

export const BOOKMARK_TARGET = ['POST', 'COMMENT'] as const
export type BookmarkTarget = (typeof BOOKMARK_TARGET)[number]

export const updateBookmarkSchema = z.object({
    target: z.enum(BOOKMARK_TARGET),
    id: idParam
})

export type UpdateBookmarkInput = z.infer<typeof updateBookmarkSchema>
export type UpdateBookmarkDTO = UpdateBookmarkInput
