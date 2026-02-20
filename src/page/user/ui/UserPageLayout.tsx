import { httpClient } from '@/server/lib'
import { TUser } from '@/shared/types/user.types'
import { UserPageProfileCard } from './UserPageProfileCard'

export const UserPageLayout = async ({
    children,
    id
}: {
    children: React.ReactNode
    id: string
}) => {
    const user = await httpClient<TUser>(`/${id}/user`, { method: 'GET' })

    return (
        <>
            <UserPageProfileCard serverData={user} />
            {children}
        </>
    )
}
