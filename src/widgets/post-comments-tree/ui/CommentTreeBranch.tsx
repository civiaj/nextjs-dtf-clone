import { memo, useMemo } from 'react'
import { useAppSelector } from '@/lib/store'
import { TComment } from '@/shared/types/comment.types'
import { cn } from '@/shared/utils/common.utils'
import { useBranchHighlighter } from '../model/hooks/useBranchHighlighter'
import { makeSelectBranchHistory } from '../model/selectors'

export const CommentTreeBranch = memo(
    ({
        id,
        isEditorHistory,
        isLoadMore
    }: {
        id: TComment['id']
        isEditorHistory?: boolean
        isLoadMore?: boolean
    }) => {
        const selectBranchHistory = useMemo(makeSelectBranchHistory, [])
        const branchHistory = useAppSelector((state) =>
            selectBranchHistory(state, id, isEditorHistory)
        )
        const { highlightBranch, removeHighlight } = useBranchHighlighter()

        return (
            <div className='flex'>
                {branchHistory.map(({ id, isEmpty, isTerminal }) => (
                    <div
                        key={id}
                        data-branch-id={id}
                        data-comment-id={id}
                        data-action={isEditorHistory && isEmpty ? 'reply' : 'expand'}
                        onMouseEnter={() => highlightBranch(id)}
                        onMouseLeave={removeHighlight}
                        className={cn(
                            'w-6 cursor-pointer border-l-2 border-[hsl(var(--color-branch))]',
                            {
                                ['pointer-events-none border-l-transparent']:
                                    isEmpty || (isLoadMore && isTerminal)
                            }
                        )}>
                        {isTerminal && (
                            <div className='pointer-events-auto h-6 w-5 translate-x-[-2px] rounded-bl-xl border-b-2 border-l-2 border-[hsl(var(--color-branch))] sm:h-10' />
                        )}
                    </div>
                ))}
            </div>
        )
    }
)

CommentTreeBranch.displayName = 'CommentTreeBranch'
