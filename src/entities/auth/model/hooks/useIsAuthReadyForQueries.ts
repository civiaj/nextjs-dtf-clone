import { useAppSelector } from '@/lib/store'

export const useIsAuthReadyForQueries = () => {
    const { staleUser, isRefreshAttempted } = useAppSelector((state) => state.auth)

    // Запросы запрещены только в одном сценарии:
    // есть пользователь из localStorage + refresh ещё не был
    const isBlocked = Boolean(staleUser) && !isRefreshAttempted

    return !isBlocked
}
