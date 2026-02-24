import { FileType, MediaContext } from '@prisma/client'
import { z } from 'zod'

export const imageSchema = z.object({
    blurDataURL: z.string().refine((val) => val.startsWith('data:image/')),
    duration: z.null(),
    format: z.union([z.literal('webp'), z.literal('jpeg')]),
    height: z.number().int().positive(),
    width: z.number().int().positive(),
    id: z.number().int().positive(),
    original_hash: z.string(),
    processed_hash: z.string(),
    size: z.number(),
    src: z.string(),
    thumbnail: z.null(),
    type: z.literal(FileType.image)
})

export const videoSchema = z.object({
    blurDataURL: z.string().refine((val) => val.startsWith('data:image/')),
    duration: z.number().int().positive(),
    format: z.union([z.literal('mp4'), z.literal('gif')]),
    height: z.number().int().positive(),
    width: z.number().int().positive(),
    id: z.number().int().positive(),
    original_hash: z.string(),
    processed_hash: z.string(),
    size: z.number(),
    src: z.string(),
    thumbnail: z.string(),
    type: z.literal(FileType.video)
})

export const uploadMediaSchema = z.object({
    file: z.instanceof(File),
    options: z.string().nullable().optional()
})

export const uploadMediaOptionsSchema = z.object({
    context: z.nativeEnum(MediaContext).optional()
})

export type UploadMediaOptionsInput = z.infer<typeof uploadMediaOptionsSchema>
export type UploadMediaInput = Omit<z.infer<typeof uploadMediaSchema>, 'options'> & {
    options?: UploadMediaOptionsInput
}
export type UploadMediaDTO = UploadMediaInput
