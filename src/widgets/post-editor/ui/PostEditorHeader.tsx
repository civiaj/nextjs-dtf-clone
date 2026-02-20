import { useAppSelector } from '@/lib/store'
import { PATH } from '@/shared/constants'
import { ContainerPadding } from '@/shared/ui/box'
import { UserAvatar } from '@/shared/ui/user-avatar'

export const PostEditorHeader = () => {
    const currentUser = useAppSelector((state) => state.auth.currentUser)

    if (!currentUser) return null

    return (
        <ContainerPadding
            withBottom
            className='border-b border-border'>
            <UserAvatar>
                <UserAvatar.Avatar
                    avatar={currentUser.avatar}
                    avatarColor={currentUser.avatarColor}
                    name={currentUser.name}
                    href={`${PATH.USER}/${currentUser.id}`}
                />
                <UserAvatar.Details>
                    <UserAvatar.Name
                        href={`${PATH.USER}/${currentUser.id}`}
                        name={currentUser.name}
                    />
                    <UserAvatar.Extra description={'Создание нового поста'} />
                </UserAvatar.Details>
            </UserAvatar>
        </ContainerPadding>
    )
}
