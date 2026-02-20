import { useRouter } from 'next/navigation'
import { useIsOwner } from '@/entities/auth'
import { PATH } from '@/shared/constants'
import { SquarePenAppIcon } from '@/shared/icons'
import { TPost } from '@/shared/types/post.types'
import { TUser } from '@/shared/types/user.types'
import { DropdownMenuItem } from '@/shared/ui/dropdown-menu'

export const EditPostDropdownItem = ({
    postId,
    userId
}: {
    postId: TPost['id']
    userId: TUser['id']
}) => {
    const { isOwner } = useIsOwner(userId)
    const router = useRouter()

    if (!isOwner) return null

    return (
        <DropdownMenuItem onClick={() => router.push(`${PATH.EDITOR}?id=${postId}`)}>
            <SquarePenAppIcon size={20} />
            Редактировать
        </DropdownMenuItem>
    )
}
