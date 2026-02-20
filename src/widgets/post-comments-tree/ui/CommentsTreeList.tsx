import { VList } from '@/components/VList'
import { useAppSelector } from '@/lib/store'
import { TComment } from '@/shared/types/comment.types'
import { CommentTreeNode } from './CommentTreeNode'
import { useScrollToParentComment } from '../model/hooks/useScrollToParentComment'
import { selectLinearTreeIds } from '../model/selectors'

export const CommentsTreeList = ({ threadId }: { threadId?: TComment['id'] }) => {
    const ids = useAppSelector((state) => selectLinearTreeIds(state))
    const ref = useScrollToParentComment(threadId)

    return (
        <VList
            mode='window'
            ref={ref}
            count={ids.length}
            estimateSize={() => 250}
            overscan={5}
            renderItem={({ index }) => <CommentTreeNode id={ids[index]} />}
        />
    )
}
