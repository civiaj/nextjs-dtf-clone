import { z } from 'zod'
import { TextValidation } from '@/shared/utils/text.utils'
import { imageSchema, videoSchema } from '@/shared/validation/media.validation'
import { baseDataSchema } from './common'
import { EDITOR_LIMIT } from './config'

const mediaDataSchema = z
    .object({
        items: z.array(
            z.object({
                media: z.union([videoSchema, imageSchema]),
                text: z.string().transform((v) => TextValidation.normalizeRegularText(v))
            })
        )
    })
    .merge(baseDataSchema)
    .superRefine((data, ctx) => {
        if (data.items.length > EDITOR_LIMIT.MEDIA.ITEMS) {
            ctx.addIssue({
                code: z.ZodIssueCode.too_big,
                type: 'string',
                maximum: EDITOR_LIMIT.MEDIA.ITEMS,
                inclusive: true,
                path: ['items'],
                message: `Максимум ${EDITOR_LIMIT.MEDIA.ITEMS} медиа элементов`
            })
        }

        data.items.forEach((item, index) => {
            const length = TextValidation.getLengthWithoutTags(item.text)
            if (length > EDITOR_LIMIT.MEDIA.LENGTH) {
                ctx.addIssue({
                    code: z.ZodIssueCode.too_big,
                    type: 'string',
                    maximum: EDITOR_LIMIT.MEDIA.LENGTH,
                    inclusive: true,
                    path: ['items', index, 'text'],
                    message: `Текст элемента слишком длинный (максимум ${EDITOR_LIMIT.MEDIA.LENGTH} символов)`
                })
            }
        })

        const ids = data.items.map((item) => item.media.id)
        const duplicates = ids.filter((id, i) => ids.indexOf(id) !== i)

        if (duplicates.length > 0) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['items'],
                message: `Найдены дублирующиеся медиа элементы: ${[...new Set(duplicates)].join(', ')}`
            })
        }
    })

export const mediaSchema = z
    .object({
        id: z.string(),
        type: z.literal('media'),
        data: mediaDataSchema
    })
    .transform(({ id: _, ...rest }) => rest)

export const validateMedia = (input: unknown) => {
    return mediaSchema.safeParse(input)
}
