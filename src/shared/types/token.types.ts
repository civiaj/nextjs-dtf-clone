import { authSelect, Prisma } from '@/shared/services/prisma'

export type TTokenSelect = Prisma.TokenGetPayload<{ select: typeof authSelect }>
