import { z } from 'zod'
import { TextValidation } from '@/shared/utils/text.utils'
import { baseDataSchema } from './common'
import { EDITOR_LIMIT } from './config'

const codeDataSchema = z
    .object({
        code: z.preprocess(
            (v) => TextValidation.normalizeCode(v),
            z.string().min(1, z.ZodIssueCode.too_small)
        )
    })
    .merge(baseDataSchema)
    .superRefine((data, ctx) => {
        const length = data.code.length
        if (length > EDITOR_LIMIT.CODE.LENGTH) {
            ctx.addIssue({
                code: z.ZodIssueCode.too_big,
                type: 'string',
                maximum: EDITOR_LIMIT.CODE.LENGTH,
                inclusive: true,
                path: ['code']
            })
        }
    })

export const codeSchema = z
    .object({
        id: z.string(),
        type: z.literal('code'),
        data: codeDataSchema
    })
    .transform(({ id: _, ...rest }) => rest)

export const validateCode = (input: unknown) => {
    return codeSchema.safeParse(input)
}
