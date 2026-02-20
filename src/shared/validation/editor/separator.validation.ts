import { z } from 'zod'
import { baseDataSchema } from './common'

const separatorDataSchema = baseDataSchema

export const separatorSchema = z
    .object({
        id: z.string(),
        type: z.literal('separator'),
        data: separatorDataSchema
    })
    .transform(({ id: _, ...rest }) => rest)

export const validateSeparator = (input: unknown) => {
    return separatorSchema.safeParse(input)
}
