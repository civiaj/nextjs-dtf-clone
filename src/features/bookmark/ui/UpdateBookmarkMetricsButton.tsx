import { MetricsButton } from '@/components/MetricsButton'
import { BookmarkAppIcon } from '@/shared/icons'
import { UpdateBookmarkInput } from '@/shared/validation/bookmark.schema'
import { useBookmarkUpdate } from '../hooks/useBookmarkUpdate'

export const UpdateBookmarkMetricsButton = ({
    id,
    isActive,
    target,
    count
}: UpdateBookmarkInput & { isActive: boolean; count: number }) => {
    const { isLoading, execute } = useBookmarkUpdate()
    const handleBookmarkUpdate = () => execute({ target, id })

    return (
        <MetricsButton
            aria-label='Добавить пост в закладки'
            disabled={isLoading}
            onClick={handleBookmarkUpdate}
            isActive={isActive}
            count={count}
            Icon={BookmarkAppIcon}
        />
    )
}
