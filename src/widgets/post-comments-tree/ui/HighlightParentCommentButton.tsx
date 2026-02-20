import { UpAppIcon } from '@/shared/icons'
import { TComment } from '@/shared/types/comment.types'

export const HighlightParentCommentButton = ({ parentId }: { parentId: TComment['parentId'] }) => {
    if (!parentId) return null

    return (
        <button
            data-action='highlight-parent'
            data-comment-parent-id={parentId}
            className='ml-1 text-foreground opacity-0 transition-opacity group-hover:opacity-100'>
            <UpAppIcon size={12} />
        </button>
    )
}
