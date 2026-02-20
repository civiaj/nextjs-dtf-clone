import { TComment } from '@/shared/types/comment.types'
import { DraftPostItem } from '@/widgets/post-draft'

export const DraftDetailsPage = ({ id }: { id: TComment['id'] }) => {
    return (
        <DraftPostItem
            id={id}
            view='full'
        />
    )
}
