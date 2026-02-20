import { prisma, userSelect, User } from '@/shared/services/prisma'
import { SignUpSchemaInput } from '@/shared/validation/user.schema'
import { IUserRepository } from './types'

export class UserRepository implements IUserRepository {
    async getById(id: User['id']) {
        return await prisma.user.findUnique({
            where: { id },
            select: userSelect
        })
    }

    async getByIds(ids: User['id'][]) {
        return await prisma.user.findMany({
            where: { id: { in: ids } },
            select: userSelect
        })
    }

    async getByEmail(email: User['email'], takePassword: boolean = false) {
        return await prisma.user.findUnique({
            where: { email },
            select: { ...userSelect, password: takePassword }
        })
    }

    async createRegular({ email, name, password }: SignUpSchemaInput) {
        const allColors = await prisma.avatarColor.findMany({
            select: { id: true }
        })

        if (allColors.length === 0) {
            throw new Error('No avatar colors found in database')
        }

        const randomIndex = Math.floor(Math.random() * allColors.length)
        const randomColorId = allColors[randomIndex].id

        return await prisma.user.create({
            data: { role: 'USER', email, name, password, avatarColorId: randomColorId },
            select: userSelect
        })
    }

    async updateRegular(
        id: User['id'],
        data: Partial<Pick<User, 'name' | 'avatarId' | 'description' | 'coverId' | 'coverY'>>
    ) {
        return await prisma.user.update({
            where: { id },
            data,
            select: userSelect
        })
    }

    async search({ query, take = 20 }: { query: string; take?: number }) {
        return await prisma.user.findMany({
            where: {
                OR: [{ name: { contains: query, mode: 'insensitive' } }]
            },
            take,
            select: userSelect,
            orderBy: { name: 'asc' }
        })
    }
}
