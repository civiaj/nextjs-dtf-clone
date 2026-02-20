import { z } from 'zod'
import { TextValidation } from '@/shared/utils/text.utils'
import { baseDataSchema } from './common'
import { EDITOR_LIMIT } from './config'

const headingDataSchema = z
    .object({
        text: z.preprocess(
            (v) => TextValidation.normalizeRegularText(v),
            z.string().min(1, z.ZodIssueCode.too_small)
        ),
        level: z.union([z.literal(1), z.literal(2)])
    })
    .merge(baseDataSchema)
    .superRefine((data, ctx) => {
        const length =
            data.level === 1 ? EDITOR_LIMIT.HEADING.H1.LENGTH : EDITOR_LIMIT.HEADING.OTHER.LENGTH
        if (data.text.length > length) {
            ctx.addIssue({
                code: z.ZodIssueCode.too_big,
                type: 'string',
                maximum: length,
                inclusive: true,
                path: ['text']
            })
        }
    })

export const headingSchema = z
    .object({
        id: z.string(),
        type: z.literal('heading'),
        data: headingDataSchema
    })
    .transform(({ id: _, ...rest }) => rest)

export const validateHeading = (input: unknown) => {
    return headingSchema.safeParse(input)
}
