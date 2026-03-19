import { IRankingService } from './types'

const DEFAULT_REFRESH_MINUTES = 10
const MIN_REFRESH_MINUTES = 1

type TGlobalWithRankingCron = typeof globalThis & {
    __rankingHotnessCronStarted?: boolean
}

const getRefreshIntervalMs = () => {
    const raw = Number(process.env.RANKING_HOTNESS_REFRESH_MINUTES)

    if (!Number.isFinite(raw) || raw < MIN_REFRESH_MINUTES) {
        return DEFAULT_REFRESH_MINUTES * 60 * 1000
    }

    return Math.floor(raw) * 60 * 1000
}

const isCronEnabled = () => {
    const explicit = process.env.RANKING_HOTNESS_CRON_ENABLED

    if (explicit === 'true') return true
    if (explicit === 'false') return false

    return process.env.NODE_ENV === 'production'
}

export const startRankingHotnessCron = (rankingService: IRankingService) => {
    if (!isCronEnabled()) return

    const globalWithCron = globalThis as TGlobalWithRankingCron

    if (globalWithCron.__rankingHotnessCronStarted) return
    globalWithCron.__rankingHotnessCronStarted = true

    const intervalMs = getRefreshIntervalMs()

    const run = async () => {
        try {
            const { postCount, commentCount } = await rankingService.refreshHotnessScores()
            console.info(
                `[ranking-cron] refreshed hotness: posts=${postCount}, comments=${commentCount}`
            )
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error)
            console.error(`[ranking-cron] refresh failed: ${message}`)
        }
    }

    void run()

    const timer = setInterval(() => {
        void run()
    }, intervalMs)

    timer.unref()

    console.info(`[ranking-cron] started, interval=${intervalMs}ms`)
}
