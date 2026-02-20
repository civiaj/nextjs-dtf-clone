import { Prisma, mutePostSelect, muteUserSelect } from '@/shared/services/prisma'

export const muteTarget = ['POST', 'USER'] as const
export type TMuteTarget = (typeof muteTarget)[number]

export type TMuteUserSelect = Prisma.MuteUserGetPayload<{ select: typeof muteUserSelect }>
export type TMuteUserMetrics = { isMuted: boolean; isMutedMe: boolean }

export type TMutePostSelect = Prisma.MutePostGetPayload<{ select: typeof mutePostSelect }>
export type TMutePostMetrics = { isMuted: boolean }
