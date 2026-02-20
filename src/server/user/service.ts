import { ApiError } from '@/lib/error'
import { IFollowUserService } from '@/server/follow-user'
import { IMuteService } from '@/server/mute'
import { ERROR_MESSAGES } from '@/shared/constants'
import { User } from '@/shared/services/prisma'
import { TUserSelect } from '@/shared/types/user.types'
import {
    GetOwnerMutedUsersDTO,
    GetUserFollowersDTO,
    GetUserSubscriptionsDTO,
    LoginSchemaInput,
    PatchUserSchemaInput,
    SignUpSchemaInput
} from '@/shared/validation/user.schema'
import { IUserEnricher, IUserRepository, IUserService } from './types'

export class UserService implements IUserService {
    constructor(
        private userRepository: IUserRepository,
        private muteService: IMuteService,
        private followUserService: IFollowUserService,
        private userEnricher: IUserEnricher
    ) {}

    async getById(id: User['id'], userId?: User['id']) {
        const user = await this.userRepository.getById(id)
        return await this.userEnricher.enrich(user, userId)
    }

    async getByIds(ids: User['id'][], userId?: User['id']) {
        if (ids.length === 0) return []
        const users = await this.userRepository.getByIds(ids)
        return await this.userEnricher.enrichAll(users, userId)
    }

    async search(query: string, userId: User['id']) {
        const users = await this.userRepository.search({ query })
        return await this.userEnricher.enrichAll(users, userId)
    }

    async createRegular(payload: SignUpSchemaInput) {
        const existed = await this.userRepository.getByEmail(payload.email)
        if (existed) throw ApiError.BadRequest(ERROR_MESSAGES.USER.USER_EXIST)

        const user = await this.userRepository.createRegular(payload)
        if (!user) throw ApiError.BadRequest(ERROR_MESSAGES.USER.USER_NOT_CREATED)

        return await this.userEnricher.enrich(user)
    }

    async updateRegular(userId: User['id'], payload: PatchUserSchemaInput) {
        const result = await this.userRepository.updateRegular(userId, payload)
        return this.userEnricher.enrich(result)
    }

    async getPrivateUser(
        email: LoginSchemaInput['email']
    ): Promise<(TUserSelect & { password: User['password'] }) | null> {
        const result = await this.userRepository.getByEmail(email, true)
        if (!result || !('password' in result)) return null
        return result
    }
    async getUserFollowers(dto: GetUserFollowersDTO, userId?: User['id']) {
        const { cursor, items } = await this.followUserService.getUserFollowers(dto)
        const users = await this.getByIds(
            items.map((e) => e.subscriberId),
            userId
        )
        return { cursor, items: users }
    }
    async getUserSubscriptions(dto: GetUserSubscriptionsDTO, userId?: User['id']) {
        const { cursor, items } = await this.followUserService.getUserSubscriptions(dto)
        const users = await this.getByIds(
            items.map((e) => e.targetUserId),
            userId
        )
        return { cursor, items: users }
    }
    async getOwnerMutedUsers(dto: GetOwnerMutedUsersDTO, userId: User['id']) {
        const { cursor, items } = await this.muteService.getAll({ userId, target: 'USER', ...dto })
        const users = await this.getByIds(
            items.map((e) => e.targetUserId),
            userId
        )
        return { cursor, items: users }
    }
}
