import { Token, User } from '@/shared/services/prisma'
import { TDeviceInfo } from '@/shared/types'
import { TTokenSelect } from '@/shared/types/token.types'

export type TokenPayload = Pick<Token, 'userId' | 'id'>

export interface ITokenRepository {
    create(
        userId: User['id'],
        deviceInfo: TDeviceInfo
    ): Promise<{ accessToken: string; refreshToken: string }>
    remove(userId: Token['userId'], id: Token['id']): Promise<void>
    find(userId: Token['userId'], id: Token['id']): Promise<TTokenSelect | null>
}

export interface ITokenService {
    verify: (contenderToken: string, name: 'access' | 'refresh') => Promise<TTokenSelect>
    create: (
        userId: User['id'],
        deviceInfo: TDeviceInfo
    ) => Promise<{ accessToken: string; refreshToken: string }>
    revoke: (userId: User['id'], id: Token['id']) => Promise<void>
    refresh: (
        refreshToken: string,
        deviceInfo: TDeviceInfo
    ) => Promise<{ tokens: { accessToken: string; refreshToken: string } }>
}
