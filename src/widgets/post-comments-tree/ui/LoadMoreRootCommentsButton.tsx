import { useAppSelector } from '@/lib/store'
import { ContainerPadding } from '@/shared/ui/box'
import { getNoun } from '@/shared/utils/string.utils'
import { LoadMoreCommentsButton } from './LoadMoreCommentsButton'
import { selectRootRemainingCommentCount } from '../model/selectors'

export const LoadMoreRootCommentsButton = ({ commentCount }: { commentCount: number }) => {
    const count = useAppSelector((state) => selectRootRemainingCommentCount(state, commentCount))
    const cursor = useAppSelector((state) => state.commentsTree.paginationCursors['null'])

    if (count <= 0) return null

    return (
        <ContainerPadding>
            <LoadMoreCommentsButton
                cursor={cursor}
                key={cursor}
                title={`${count} ${getNoun(count, 'комментарий', 'комментария', 'комментариев')}`}
            />
        </ContainerPadding>
    )
}
