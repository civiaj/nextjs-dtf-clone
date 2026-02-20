import { User } from '@/shared/services/prisma'
import { TUser, TUserSelect } from '@/shared/types/user.types'
import {
    GetOwnerMutedUsersDTO,
    GetUserFollowersDTO,
    GetUserSubscriptionsDTO,
    PatchUserSchemaInput,
    SignUpSchemaInput
} from '@/shared/validation/user.schema'

export interface IUserEnricher {
    enrich: (user: TUserSelect | null, userId?: User['id']) => Promise<TUser>
    enrichAll: (users: TUserSelect[], userId?: User['id']) => Promise<TUser[]>
}

export interface IUserService {
    getById(id: User['id'], userId?: User['id']): Promise<TUser>
    getByIds(ids: User['id'][], userId?: User['id']): Promise<TUser[]>
    createRegular(data: SignUpSchemaInput): Promise<TUser>
    updateRegular(userId: User['id'], data: PatchUserSchemaInput): Promise<TUser>
    getUserFollowers(
        dto: GetUserFollowersDTO,
        userId?: User['id']
    ): Promise<{ items: TUser[]; cursor: number | null }>
    getUserSubscriptions(
        dto: GetUserSubscriptionsDTO,
        userId?: User['id']
    ): Promise<{ items: TUser[]; cursor: number | null }>
    getOwnerMutedUsers(
        dto: GetOwnerMutedUsersDTO,
        userId: User['id']
    ): Promise<{ items: TUser[]; cursor: number | null }>
}

export interface IUserRepository {
    getById(id: User['id']): Promise<TUserSelect | null>
    getByIds(ids: User['id'][]): Promise<TUserSelect[]>
    getByEmail(
        email: User['email'],
        takePassword?: boolean
    ): Promise<TUserSelect | null | (TUserSelect & { password: User['password'] })>
    createRegular(data: SignUpSchemaInput): Promise<TUserSelect>
    updateRegular(id: User['id'], payload: PatchUserSchemaInput): Promise<TUserSelect>
    search(payload: { query: string; take?: number }): Promise<TUserSelect[]>
}
