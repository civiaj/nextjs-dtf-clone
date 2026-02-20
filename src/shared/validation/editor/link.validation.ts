import { z } from 'zod'
import { imageSchema } from '@/shared/validation/media/media.validation'
import { baseDataSchema } from './common'

const linkDataSchema = z
    .object({
        description: z.string(),
        hostname: z.string(),
        title: z.string(),
        url: z.string(),
        image: imageSchema
    })
    .merge(baseDataSchema)

export const linkSchema = z
    .object({
        id: z.string(),
        type: z.literal('link'),
        data: linkDataSchema
    })
    .transform(({ id: _, ...rest }) => rest)

export const validateLink = (input: unknown) => {
    return linkSchema.safeParse(input)
}
