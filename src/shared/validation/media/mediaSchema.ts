import { z } from 'zod'

const mediaUploadOptionsSchema = z
    .object({
        isAvatar: z.boolean().optional(),
        isCover: z.boolean().optional()
    })
    .refine(
        (data) => {
            const avatar = data.isAvatar ?? false
            const cover = data.isCover ?? false
            return !(avatar && cover)
        },
        {
            message: 'Нельзя указывать и isAvatar, и isCover одновременно'
        }
    )
    .optional()

export const mediaUploadSchema = z.object({
    file: z.instanceof(File, { message: 'Файл обязателен' }),
    options: z
        .string()
        .nullable()
        .optional()
        .transform((str) => {
            if (!str) return undefined
            try {
                return mediaUploadOptionsSchema.parse(JSON.parse(str))
            } catch {}
        })
})

export type MediaUploadSchemaInput = z.infer<typeof mediaUploadSchema>
