import { prisma, reactionValueSelect } from '@/shared/services/prisma'
import { IReactionValueRepository } from '../types'

export class ReactionValueRepository implements IReactionValueRepository {
    async getAll() {
        return await prisma.reactionValue.findMany({
            select: reactionValueSelect
        })
    }

    async getDefaultValue() {
        return await prisma.reactionValue.findUnique({
            where: { id: 1 },
            select: reactionValueSelect
        })
    }
}
