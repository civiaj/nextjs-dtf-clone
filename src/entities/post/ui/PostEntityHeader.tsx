import { ReactNode } from 'react'
import { PATH } from '@/shared/constants'
import { TPost } from '@/shared/types/post.types'
import { ContainerPadding } from '@/shared/ui/box'
import { UserAvatar } from '@/shared/ui/user-avatar'

type Props = {
    user: TPost['user']
    description: string
    descriptionExtra?: ReactNode
    rightSlot?: ReactNode
}

export const PostEntityHeader = ({ user, description, descriptionExtra, rightSlot }: Props) => {
    return (
        <ContainerPadding className='flex items-start'>
            <UserAvatar>
                <UserAvatar.Avatar
                    avatar={user.avatar}
                    avatarColor={user.avatarColor}
                    name={user.name}
                    href={`${PATH.USER}/${user.id}`}
                />
                <UserAvatar.Details>
                    <UserAvatar.Name
                        href={`${PATH.USER}/${user.id}`}
                        name={user.name}
                    />
                    <UserAvatar.Extra description={description}>
                        {descriptionExtra}
                    </UserAvatar.Extra>
                </UserAvatar.Details>
            </UserAvatar>
            {rightSlot ? <div className='ml-auto flex items-center gap-2'>{rightSlot}</div> : null}
        </ContainerPadding>
    )
}
