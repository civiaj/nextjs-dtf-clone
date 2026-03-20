export const HOUR_IN_MS = 60 * 60 * 1000
export const MINUTE_IN_MS = 60 * 1000

export const HOTNESS_TIME_DELAY_HOURS = 0
export const HOTNESS_GRAVITY = 1.35
export const HOTNESS_BASE_OFFSET_HOURS = 2
export const HOTNESS_REFRESH_BATCH_SIZE = 500
export const HOTNESS_REFRESH_FRESH_INTERVAL_MINUTES = 10
export const HOTNESS_REFRESH_RECENT_INTERVAL_MINUTES = 60
export const HOTNESS_REFRESH_STALE_INTERVAL_MINUTES = 60 * 6

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
