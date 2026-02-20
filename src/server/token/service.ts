import { ApiError } from '@/lib/error'
import { ERROR_MESSAGES } from '@/shared/constants'
import { Token, User } from '@/shared/services/prisma'
import { TDeviceInfo } from '@/shared/types'
import { ITokenService, ITokenRepository } from './types'
import { jwtVerifyAccess, jwtVerifyRefresh } from './utils/jwt'

export class TokenService implements ITokenService {
    constructor(private tokenRepository: ITokenRepository) {}
    async verify(contenderToken: string, name: 'access' | 'refresh') {
        let decode

        switch (name) {
            case 'access': {
                decode = jwtVerifyAccess(contenderToken)
                break
            }
            case 'refresh': {
                decode = jwtVerifyRefresh(contenderToken)
                break
            }
        }

        if (!decode) {
            throw ApiError.Unauthorized(ERROR_MESSAGES.USER.TOKEN_EXPIRED)
        }

        const token = await this.tokenRepository.find(decode.userId, decode.id)

        console.log({ token })

        if (!token) throw ApiError.Unauthorized(ERROR_MESSAGES.USER.TOKEN_EXPIRED)

        return token
    }

    async create(userId: User['id'], deviceInfo: TDeviceInfo) {
        return await this.tokenRepository.create(userId, deviceInfo)
    }

    async revoke(userId: User['id'], id: Token['id']) {
        return await this.tokenRepository.remove(userId, id)
    }

    async refresh(refreshToken: string, deviceInfo: TDeviceInfo) {
        const token = await this.verify(refreshToken, 'refresh')

        const tokens = await this.create(token.user.id, deviceInfo)

        await this.revoke(token.user.id, token.id)
        return { tokens, userId: token.user.id }
    }
}
