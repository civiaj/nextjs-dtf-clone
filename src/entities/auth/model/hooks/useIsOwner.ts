import { useAppSelector } from '@/lib/store'
import { TUser } from '@/shared/types/user.types'

export const useIsOwner = (candidateId: TUser['id']) => {
    const staleUser = useAppSelector((state) => state.auth.staleUser)
    return { owner: staleUser, isOwner: Boolean(staleUser && staleUser.id === candidateId) }
}
