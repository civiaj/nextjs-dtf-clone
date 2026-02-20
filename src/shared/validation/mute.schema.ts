import { z } from 'zod'
import { muteTarget } from '@/shared/types/mute.types'

export const createMuteSchema = z.object({
    target: z.enum(muteTarget),
    targetId: z.number().positive().max(Number.MAX_SAFE_INTEGER),
    action: z.enum(['mute', 'unmute'])
})

export type CreateMuteInput = z.infer<typeof createMuteSchema>
