import { MONTH_WINDOW_HOURS, subtractHours, YEAR_WINDOW_HOURS } from '@/server/ranking'
import { Prisma } from '@/shared/services/prisma'
import { GetPostCommentsDTO, GetUserCommentsDTO } from '@/shared/validation/comment.schema'

const COMMENT_BY_DATE_ORDER: Prisma.CommentOrderByWithRelationInput[] = [
    { createdAt: 'desc' },
    { id: 'desc' }
]

const COMMENT_BY_HOT_SCORE_ORDER: Prisma.CommentOrderByWithRelationInput[] = [
    { hotScore: 'desc' },
    { createdAt: 'desc' },
    { id: 'desc' }
]

const COMMENT_BY_HOTNESS_ORDER: Prisma.CommentOrderByWithRelationInput[] = [
    { hotnessScore: 'desc' },
    { createdAt: 'desc' },
    { id: 'desc' }
]

export const getPostCommentsOrderBy = (
    sortBy: GetPostCommentsDTO['sortBy']
): Prisma.CommentOrderByWithRelationInput[] => {
    switch (sortBy) {
        case 'hotness':
            return COMMENT_BY_HOTNESS_ORDER
        case 'new':
        default:
            return COMMENT_BY_DATE_ORDER
    }
}

export const getUserCommentsOrderBy = ({
    where,
    sortBy,
    now
}: {
    where: Prisma.CommentWhereInput
    sortBy: GetUserCommentsDTO['sortBy']
    now: Date
}): Prisma.CommentOrderByWithRelationInput[] => {
    switch (sortBy) {
        case 'new': {
            return COMMENT_BY_DATE_ORDER
        }
        case 'hotness': {
            return COMMENT_BY_HOTNESS_ORDER
        }
        case 'month': {
            where.createdAt = { gte: subtractHours(now, MONTH_WINDOW_HOURS) }
            return COMMENT_BY_HOT_SCORE_ORDER
        }
        case 'year': {
            where.createdAt = { gte: subtractHours(now, YEAR_WINDOW_HOURS) }
            return COMMENT_BY_HOT_SCORE_ORDER
        }
        case 'all': {
            return COMMENT_BY_HOT_SCORE_ORDER
        }
        default: {
            return COMMENT_BY_DATE_ORDER
        }
    }
}
