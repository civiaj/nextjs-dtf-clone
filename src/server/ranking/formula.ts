import {
    COMMENT_RANKING_WEIGHTS,
    HOTNESS_BASE_OFFSET_HOURS,
    HOTNESS_GRAVITY,
    HOUR_IN_MS,
    MINUTE_IN_MS,
    POST_RANKING_WEIGHTS
} from './constants'

type THotnessInput = {
    hotScore: number
    createdAt: Date
    now?: Date
}

export const calculatePostHotScore = ({
    reactionCount,
    bookmarkCount,
    commentCount
}: {
    reactionCount: number
    bookmarkCount: number
    commentCount: number
}) =>
    reactionCount * POST_RANKING_WEIGHTS.reaction +
    bookmarkCount * POST_RANKING_WEIGHTS.bookmark +
    commentCount * POST_RANKING_WEIGHTS.comment

export const calculateCommentHotScore = ({
    reactionCount,
    bookmarkCount,
    replyCount
}: {
    reactionCount: number
    bookmarkCount: number
    replyCount: number
}) =>
    reactionCount * COMMENT_RANKING_WEIGHTS.reaction +
    bookmarkCount * COMMENT_RANKING_WEIGHTS.bookmark +
    replyCount * COMMENT_RANKING_WEIGHTS.reply

export const calculateHotnessScore = ({ hotScore, createdAt, now = new Date() }: THotnessInput) => {
    if (hotScore <= 0) return 0
    const ageHours = Math.max(0, (now.getTime() - createdAt.getTime()) / HOUR_IN_MS)
    const decayBase = ageHours + HOTNESS_BASE_OFFSET_HOURS
    return hotScore / Math.pow(decayBase, HOTNESS_GRAVITY)
}

export const subtractHours = (date: Date, hours: number) =>
    new Date(date.getTime() - hours * HOUR_IN_MS)

export const addMinutes = (date: Date, minutes: number) =>
    new Date(date.getTime() + minutes * MINUTE_IN_MS)
