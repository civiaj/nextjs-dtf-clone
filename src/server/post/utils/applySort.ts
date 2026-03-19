import {
    DAY_WINDOW_HOURS,
    HOTNESS_TIME_DELAY_HOURS,
    HOTNESS_WINDOW_HOURS,
    MONTH_WINDOW_HOURS,
    subtractHours,
    WEEK_WINDOW_HOURS,
    YEAR_WINDOW_HOURS
} from '@/server/ranking'
import { Prisma, User } from '@/shared/services/prisma'
import { GetFeedPostsDTO, GetUserPostsDTO } from '@/shared/validation/post.schema'

const POST_BY_DATE_ORDER: Prisma.PostOrderByWithRelationInput[] = [
    { publishedAt: 'desc' },
    { id: 'desc' }
]

const POST_BY_HOTNESS_ORDER: Prisma.PostOrderByWithRelationInput[] = [
    { hotnessScore: 'desc' },
    { publishedAt: 'desc' },
    { id: 'desc' }
]

const POST_BY_HOT_SCORE_ORDER: Prisma.PostOrderByWithRelationInput[] = [
    { hotScore: 'desc' },
    { publishedAt: 'desc' },
    { id: 'desc' }
]

export const applyFeedSort = ({
    where,
    sortBy,
    userId,
    now
}: {
    where: Prisma.PostWhereInput
    sortBy: GetFeedPostsDTO['sortBy']
    userId?: User['id']
    now: Date
}): Prisma.PostOrderByWithRelationInput[] => {
    switch (sortBy) {
        case 'hotness': {
            where.publishedAt = {
                gte: subtractHours(now, HOTNESS_WINDOW_HOURS),
                lte: subtractHours(now, HOTNESS_TIME_DELAY_HOURS)
            }
            return POST_BY_HOTNESS_ORDER
        }
        case 'day': {
            where.publishedAt = { gte: subtractHours(now, DAY_WINDOW_HOURS) }
            return POST_BY_HOT_SCORE_ORDER
        }
        case 'week': {
            where.publishedAt = { gte: subtractHours(now, WEEK_WINDOW_HOURS) }
            return POST_BY_HOT_SCORE_ORDER
        }
        case 'month': {
            where.publishedAt = { gte: subtractHours(now, MONTH_WINDOW_HOURS) }
            return POST_BY_HOT_SCORE_ORDER
        }
        case 'year': {
            where.publishedAt = { gte: subtractHours(now, YEAR_WINDOW_HOURS) }
            return POST_BY_HOT_SCORE_ORDER
        }
        case 'all': {
            return POST_BY_HOT_SCORE_ORDER
        }
        case 'latest': {
            return POST_BY_DATE_ORDER
        }
        case 'latest-5': {
            where.publishedAt = { lte: subtractHours(now, 5) }
            return POST_BY_DATE_ORDER
        }
        case 'latest-10': {
            where.publishedAt = { lte: subtractHours(now, 10) }
            return POST_BY_DATE_ORDER
        }
        case 'new': {
            if (!userId) {
                where.id = -1
                return POST_BY_DATE_ORDER
            }

            where.user = {
                followers: {
                    some: { subscriberId: userId }
                }
            }

            return POST_BY_DATE_ORDER
        }
        case 'popular': {
            if (!userId) {
                where.id = -1
                return POST_BY_HOTNESS_ORDER
            }

            where.user = {
                followers: {
                    some: { subscriberId: userId }
                }
            }
            where.publishedAt = {
                gte: subtractHours(now, HOTNESS_WINDOW_HOURS),
                lte: subtractHours(now, HOTNESS_TIME_DELAY_HOURS)
            }

            return POST_BY_HOTNESS_ORDER
        }
        default: {
            return POST_BY_DATE_ORDER
        }
    }
}

export const applyUserPostsSort = ({
    where,
    sortBy,
    now
}: {
    where: Prisma.PostWhereInput
    sortBy: GetUserPostsDTO['sortBy']
    now: Date
}): Prisma.PostOrderByWithRelationInput[] => {
    switch (sortBy) {
        case 'new': {
            return POST_BY_DATE_ORDER
        }
        case 'hotness': {
            where.publishedAt = {
                gte: subtractHours(now, WEEK_WINDOW_HOURS),
                lte: subtractHours(now, HOTNESS_TIME_DELAY_HOURS)
            }
            return POST_BY_HOTNESS_ORDER
        }
        case 'month': {
            where.createdAt = { gte: subtractHours(now, MONTH_WINDOW_HOURS) }
            return POST_BY_HOT_SCORE_ORDER
        }
        case 'year': {
            where.createdAt = { gte: subtractHours(now, YEAR_WINDOW_HOURS) }
            return POST_BY_HOT_SCORE_ORDER
        }
        case 'all': {
            return POST_BY_HOT_SCORE_ORDER
        }
        default: {
            return POST_BY_DATE_ORDER
        }
    }
}
