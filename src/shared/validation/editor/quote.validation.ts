import { z } from 'zod'
import { TextValidation } from '@/shared/utils/text.utils'
import { baseDataSchema } from './common'
import { EDITOR_LIMIT } from './config'

const quoteDataSchema = z
    .object({
        text: z.preprocess(
            (v) => TextValidation.normalizeWithTags(v),
            z.string().min(1, z.ZodIssueCode.too_small)
        ),
        caption: z.preprocess((v) => TextValidation.normalizeCaption(v), z.string())
    })
    .merge(baseDataSchema)
    .superRefine((data, ctx) => {
        const length = [data.caption, data.text].reduce(
            (acc, el) => acc + TextValidation.getLengthWithoutTags(el),
            0
        )
        if (length > EDITOR_LIMIT.QUOTE.LENGTH) {
            ctx.addIssue({
                code: z.ZodIssueCode.too_big,
                type: 'string',
                maximum: EDITOR_LIMIT.QUOTE.LENGTH,
                inclusive: true,
                path: ['text']
            })
        }
    })

export const quoteSchema = z
    .object({
        id: z.string(),
        type: z.literal('quote'),
        data: quoteDataSchema
    })
    .transform(({ id: _, ...rest }) => rest)

export const validateQuote = (input: unknown) => {
    return quoteSchema.safeParse(input)
}
