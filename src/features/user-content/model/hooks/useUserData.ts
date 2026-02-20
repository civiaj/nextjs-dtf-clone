import { useIsAuthReadyForQueries } from '@/entities/auth'
import { selectUser, useGetUserQuery } from '@/entities/user'
import { useAppSelector } from '@/lib/store'
import { TUser } from '@/shared/types/user.types'

export const useUserData = (
    id: TUser['id'],
    { serverData, skip }: { serverData?: TUser; skip?: boolean } = {}
) => {
    const isAuthReady = useIsAuthReadyForQueries()
    const user = useAppSelector((state) => selectUser(state, id))

    useGetUserQuery(id, { skip: !isAuthReady || Boolean(user) || skip })

    return { user: user ?? serverData, isClientData: Boolean(user) }
}
