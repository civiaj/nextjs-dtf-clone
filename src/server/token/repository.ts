import { REFRESH_TOKEN } from '@/server/constants'
import { authSelect, prisma, Token, User } from '@/shared/services/prisma'
import { TDeviceInfo } from '@/shared/types'
import { TTokenSelect } from '@/shared/types/token.types'
import { generateUUID } from '@/shared/utils/common.utils'
import { ITokenRepository } from './types'
import { jwtCreatePair } from './utils/jwt'

export class TokenRepository implements ITokenRepository {
    async create(userId: User['id'], deviceInfo: TDeviceInfo) {
        const id = generateUUID()
        const { accessToken, refreshToken } = jwtCreatePair({ id, userId })
        const expires = new Date(Date.now() + REFRESH_TOKEN.options.maxAge * 1000)

        await prisma.token.create({
            data: {
                id,
                userId,
                deviceInfo,
                expires,
                refreshToken
            },
            select: authSelect
        })

        return { accessToken, refreshToken }
    }

    async remove(userId: Token['userId'], id: Token['id']) {
        await prisma.token.delete({
            where: { id, userId },
            select: authSelect
        })
    }

    async find(userId: Token['userId'], id: Token['id']): Promise<TTokenSelect | null> {
        const token = await prisma.token.findUnique({
            where: { id, userId },
            select: authSelect
        })

        if (token && token.expires < new Date()) {
            await prisma.token.delete({ where: { id } })
            return null
        }

        return token
    }
}
