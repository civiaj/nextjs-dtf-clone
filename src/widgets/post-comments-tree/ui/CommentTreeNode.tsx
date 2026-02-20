import { memo } from 'react'
import { TComment } from '@/shared/types/comment.types'
import { CommentTreeBranch } from './CommentTreeBranch'
import { CommentTreeItem } from './CommentTreeItem'
import { CommentTreeLoadMoreButtons } from './CommentTreeLoadMoreButtons'

type Props = { id: TComment['id'] }

export const CommentTreeNode = memo(({ id }: Props) => {
    return (
        <div
            data-comment-highlight-id={id}
            className='flex flex-col px-3 transition-all sm:px-6'>
            <div className='flex'>
                <CommentTreeBranch id={id} />
                <CommentTreeItem id={id} />
            </div>
            <CommentTreeLoadMoreButtons id={id} />
        </div>
    )
})

CommentTreeNode.displayName = 'CommentTreeNode'
