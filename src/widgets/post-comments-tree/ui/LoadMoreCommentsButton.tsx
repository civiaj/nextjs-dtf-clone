import { useState } from 'react'
import { TComment } from '@/shared/types/comment.types'
import { Button } from '@/shared/ui/button'
import { LoadingDots } from '@/shared/ui/loading-indicator'
import { cn } from '@/shared/utils/common.utils'
import { useGetPostComments } from '../model/hooks/useGetPostComments'

export const LoadMoreCommentsButton = ({
    title,
    cursor,
    parentId,
    className
}: {
    title: string
    parentId?: TComment['parentId']
    cursor?: number
    className?: string
}) => {
    const [enabled, setEnabled] = useState(false)
    const query = useGetPostComments({ cursor, parentId, enabled })
    const isLoading = query.isLoading || query.isFetching
    const handleClick = () => {
        setEnabled(true)
    }

    return (
        <div className={cn('flex items-center gap-2', className)}>
            <Button
                disabled={isLoading}
                onClick={handleClick}
                variant={'clean-active'}
                size={'auto'}>
                {title}
            </Button>
            {isLoading && <LoadingDots className='h-1 w-1 bg-active md:h-1 md:w-1' />}
        </div>
    )
}
