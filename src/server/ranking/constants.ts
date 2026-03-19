export const HOUR_IN_MS = 60 * 60 * 1000

export const HOTNESS_WINDOW_HOURS = 24
export const HOTNESS_TIME_DELAY_HOURS = 0
export const HOTNESS_GRAVITY = 1.35
export const HOTNESS_BASE_OFFSET_HOURS = 2
export const HOTNESS_REFRESH_WINDOW_HOURS = HOTNESS_WINDOW_HOURS

export const DAY_WINDOW_HOURS = 24
export const WEEK_WINDOW_HOURS = 24 * 7
export const MONTH_WINDOW_HOURS = 24 * 30
export const YEAR_WINDOW_HOURS = 24 * 365

export const POST_RANKING_WEIGHTS = {
    reaction: 1,
    bookmark: 2,
    comment: 1
} as const

export const COMMENT_RANKING_WEIGHTS = {
    reaction: 1,
    bookmark: 2,
    reply: 1.5
} as const
