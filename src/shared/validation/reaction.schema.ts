import { z } from 'zod'
import { reactionTarget } from '@/shared/types/reaction.types'
import { idParam } from '@/shared/validation/common.schema'

export const updateReactionSchema = z.object({
    target: z.enum(reactionTarget),
    targetId: z.number().positive(),
    reactionValueId: z.number().positive().max(Number.MAX_SAFE_INTEGER)
})

export const getAllReactionsSchema = z.object({
    target: z.enum(reactionTarget),
    cursor: idParam.optional()
})

export type TUpdateReactionInput = z.infer<typeof updateReactionSchema>
export type TGetAllReactionsInput = z.infer<typeof getAllReactionsSchema>
