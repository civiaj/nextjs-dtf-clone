import { z } from 'zod'
import { TextValidation } from '@/shared/utils/text.utils'
import { baseDataSchema } from './common'
import { EDITOR_LIMIT } from './config'

const paragraphDataSchema = z
    .object({
        text: z.preprocess(
            (v) => TextValidation.normalizeWithTags(v),
            z.string().min(1, z.ZodIssueCode.too_small)
        )
    })
    .merge(baseDataSchema)
    .superRefine((data, ctx) => {
        const length = TextValidation.getLengthWithoutTags(data.text)
        if (length > EDITOR_LIMIT.PARAGRAPH.LENGTH) {
            ctx.addIssue({
                code: z.ZodIssueCode.too_big,
                type: 'string',
                maximum: EDITOR_LIMIT.PARAGRAPH.LENGTH,
                inclusive: true,
                path: ['text']
            })
        }
    })

export const paragraphSchema = z
    .object({
        id: z.string(),
        type: z.literal('paragraph'),
        data: paragraphDataSchema
    })
    .transform(({ id: _, ...rest }) => rest)

export const validateParagraph = (input: unknown) => {
    return paragraphSchema.safeParse(input)
}
