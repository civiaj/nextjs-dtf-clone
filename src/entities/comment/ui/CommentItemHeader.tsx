import { PATH } from '@/shared/constants'
import { TComment } from '@/shared/types/comment.types'
import { TUser } from '@/shared/types/user.types'
import { UserAvatar } from '@/shared/ui/user-avatar'
import { getAtDate } from '@/shared/utils/date.utils'
import { CommentItemDropdown, CommentItemDropdownProps } from './CommentItemDropdown'

type CommentItemHeaderProps = {
    user: Pick<TUser, 'id' | 'name' | 'avatar' | 'avatarColor'>
    createdAt: TComment['createdAt']
    extra?: React.ReactNode
    dropdownActions: CommentItemDropdownProps['actions']
}

export const CommentItemHeader = ({
    user,
    createdAt,
    extra,
    dropdownActions
}: CommentItemHeaderProps) => {
    return (
        <div className='mb-2 flex items-start'>
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
                    <UserAvatar.Extra description={getAtDate(createdAt)}>{extra}</UserAvatar.Extra>
                </UserAvatar.Details>
            </UserAvatar>
            {dropdownActions ? <CommentItemDropdown actions={dropdownActions} /> : null}
        </div>
    )
}
