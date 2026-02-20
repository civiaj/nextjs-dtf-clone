import { z } from 'zod'
import { FOLLOW_USER_ACTIONS } from '@/shared/types/follow.types'
import { idParam } from '@/shared/validation/common.schema'

export const updateUserFollowSchema = z.object({
    action: z.enum(FOLLOW_USER_ACTIONS),
    id: idParam
})

export const createTestFollowersSchema = z.object({ userId: idParam }).strict()

export type UpdateUserFollowInput = z.infer<typeof updateUserFollowSchema>
export type UpdateUserFollowDTO = UpdateUserFollowInput
