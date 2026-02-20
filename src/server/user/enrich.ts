import { User } from '@prisma/client'
import { ApiError } from '@/lib/error'
import { IFollowUserService } from '@/server/follow-user'
import { IMuteService } from '@/server/mute'
import { ERROR_MESSAGES } from '@/shared/constants'
import { TUser, TUserSelect } from '@/shared/types/user.types'
import { IUserEnricher } from './types'

export class UserEnricher implements IUserEnricher {
    constructor(
        private FollowUserService: IFollowUserService,
        private MuteService: IMuteService
    ) {}

    async enrich(user: TUserSelect | null, userId?: User['id']) {
        if (!user) throw ApiError.BadRequest(ERROR_MESSAGES.USER.USER_NOT_FOUND)
        const [enriched] = await this.enrichAll([user], userId)
        return enriched
    }

    async enrichAll(users: TUserSelect[], userId?: User['id']) {
        if (users.length === 0) return users as TUser[]

        const ids = [...new Set(users.map((u) => u.id))]

        const [follows, mutes] = await Promise.all([
            this.FollowUserService.getMetrics({ ids, userId }),
            this.MuteService.getMetrics({ ids, userId, target: 'USER' })
        ])

        return users.map((u) => ({
            ...u,
            ...follows.get(u.id)!,
            ...mutes.get(u.id)!
        }))
    }
}
