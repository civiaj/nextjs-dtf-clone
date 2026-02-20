import { z } from 'zod'
import { TextValidation } from '@/shared/utils/text.utils'
import { codeSchema } from './code.validation'
import { EDITOR_LIMIT } from './config'
import { headingSchema } from './heading.validation'
import { linkSchema } from './link.validation'
import { listSchema } from './list.validation'
import { mediaSchema } from './media.validation'
import { paragraphSchema } from './paragraph.validation'
import { quoteSchema } from './quote.validation'
import { separatorSchema } from './separator.validation'

export const editorSchema = z.object({
    time: z.number().int().positive(),
    version: z.string(),
    blocks: z.array(
        z.union([
            codeSchema,
            headingSchema,
            linkSchema,
            listSchema,
            mediaSchema,
            paragraphSchema,
            quoteSchema,
            separatorSchema
        ])
    )
})

export const editorSchemaTransformed = editorSchema
    .transform(({ blocks }) => {
        return blocks
            .map((block) => {
                if ('text' in block.data) {
                    const length = TextValidation.getLengthWithoutTags(block.data.text)
                    if (!length) return null
                    return block
                }

                if ('items' in block.data) {
                    const length = block.data.items.length
                    if (!length) return null
                    return block
                }

                return block
            })
            .filter((block) => block !== null)
            .map((block, index) => {
                if (block.type === 'heading') {
                    if (index === 0) {
                        return {
                            ...block,
                            data: {
                                ...block.data,
                                level: 1
                            }
                        }
                    } else {
                        return {
                            ...block,
                            data: {
                                ...block.data,
                                level: 2
                            }
                        }
                    }
                }
                return block
            })
    })
    .superRefine((blocks, ctx) => {
        if (!Array.isArray(blocks)) return

        if (blocks.length > EDITOR_LIMIT.BLOCK.ITEMS) {
            ctx.addIssue({
                code: z.ZodIssueCode.too_big,
                type: 'array',
                maximum: EDITOR_LIMIT.BLOCK.ITEMS,
                inclusive: true,
                path: ['blocks']
            })
        }

        if (!blocks.length) {
            ctx.addIssue({
                code: z.ZodIssueCode.too_small,
                type: 'array',
                minimum: 1,
                inclusive: true,
                path: ['blocks']
            })
        }

        const coverCount = blocks.filter((block) => block.data.isCover).length

        if (coverCount > EDITOR_LIMIT.BLOCK.COVER) {
            ctx.addIssue({
                code: z.ZodIssueCode.too_big,
                type: 'array',
                maximum: EDITOR_LIMIT.BLOCK.COVER,
                inclusive: true,
                path: ['cover']
            })
        }
    })

export type PostBlocksInput = z.infer<typeof editorSchemaTransformed>
export type PostBlocksDTO = PostBlocksInput
