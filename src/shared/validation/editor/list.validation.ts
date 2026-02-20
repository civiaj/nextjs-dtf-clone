import { z } from 'zod'
import { TextValidation } from '@/shared/utils/text.utils'
import { baseDataSchema } from './common'
import { EDITOR_LIMIT } from './config'

const listDataSchema = z
    .object({
        style: z.enum(['unordered', 'ordered']),
        items: z.array(z.object({ content: z.string() })).transform((items) =>
            items
                .map((item) => {
                    const normalized = TextValidation.normalizeListItem(item.content)
                    return normalized.length > 0 ? { content: normalized } : null
                })
                .filter((v) => v !== null)
        )
    })
    .merge(baseDataSchema)
    .superRefine((data, ctx) => {
        const length = data.items.reduce(
            (acc, { content }) => acc + TextValidation.getLengthWithoutTags(content),
            0
        )
        if (length > EDITOR_LIMIT.LIST.LENGTH) {
            ctx.addIssue({
                code: z.ZodIssueCode.too_big,
                type: 'string',
                maximum: EDITOR_LIMIT.LIST.LENGTH,
                inclusive: true,
                path: ['items']
            })
        }
    })

export const listSchema = z
    .object({
        id: z.string(),
        type: z.literal('list'),
        data: listDataSchema
    })
    .transform(({ id: _, ...rest }) => rest)

export const validateList = (input: unknown) => {
    return listSchema.safeParse(input)
}
