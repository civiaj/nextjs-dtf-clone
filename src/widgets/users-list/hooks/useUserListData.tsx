import { useMemo } from 'react'
import { useIsAuthReadyForQueries } from '@/entities/auth'
import { useGetUsersInfiniteQuery } from '@/entities/user'
import { useAppSelector } from '@/lib/store'
import { GetUsersInput } from '@/shared/validation/user.schema'

export const useUserListData = (input: GetUsersInput) => {
    const isAuthReady = useIsAuthReadyForQueries()
    const entities = useAppSelector((state) => state.user.data.entities)

    const query = useGetUsersInfiniteQuery(input, { skip: !isAuthReady })
    const ids = useMemo(
        () => query.data?.pages.flatMap((p) => p.result.items.map((i) => i.id)) ?? [],
        [query.data?.pages]
    )

    const visibleIds = useMemo(() => {
        if (input.type !== 'owner-muted-users') return ids
        return ids.filter((id) => entities[id]?.isMuted !== false)
    }, [ids, entities, input.type])

    return { ...query, ids: visibleIds }
}
