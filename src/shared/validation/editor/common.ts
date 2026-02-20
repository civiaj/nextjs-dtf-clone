import { z } from 'zod'

export const baseDataSchema = z.object({
    isHidden: z.boolean().default(false),
    isCover: z.boolean().default(false)
})

export const baseBlockSchema = z
    .object({
        id: z.string()
    })
    .transform(({ id: _, ...rest }) => rest)
