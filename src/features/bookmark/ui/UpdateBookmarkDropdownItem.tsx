import { BookmarkAppIcon } from '@/shared/icons'
import { DropdownMenuItem } from '@/shared/ui/dropdown-menu'
import { UpdateBookmarkInput } from '@/shared/validation/bookmark.schema'
import { useBookmarkUpdate } from '../hooks/useBookmarkUpdate'

export const UpdateBookmarkDropdownItem = ({
    id,
    isActive,
    target
}: UpdateBookmarkInput & { isActive: boolean }) => {
    const { isLoading, execute } = useBookmarkUpdate()
    const handleBookmarkUpdate = () => execute({ target, id })

    return (
        <DropdownMenuItem
            onClick={handleBookmarkUpdate}
            className='flex gap-3'
            isActive={isActive}
            disabled={isLoading}>
            <BookmarkAppIcon size={20} />
            {isActive ? 'Удалить из закладок' : 'Добавить в закладки'}
        </DropdownMenuItem>
    )
}
