import { Skeleton } from '@/shared/ui/skeleton'

const CommentHeaderSkeleton = () => {
    return (
        <div className='flex items-center justify-between'>
            <div className='flex flex-1 items-center gap-3'>
                <Skeleton className='h-8 w-8 rounded-full md:h-9 md:w-9' />
                <div className='flex flex-1 flex-col gap-1'>
                    <Skeleton className='h-3 w-1/5' />
                    <Skeleton className='h-3 w-1/6' />
                </div>
            </div>
        </div>
    )
}

const CommentBodySkeleton = () => {
    return (
        <div className='mt-1 flex flex-col gap-1 sm:mt-2'>
            <Skeleton className='h-3 w-10/12' />
            <Skeleton className='h-3 w-1/2' />
            <Skeleton className='h-3 w-full' />
        </div>
    )
}

const CommentFooterSkeleton = () => {
    return (
        <div className='mt-1 flex items-center gap-3 sm:mt-2'>
            <Skeleton className='h-3 w-28' />
            <Skeleton className='h-3 w-20' />
        </div>
    )
}

export const CommentItemSkeleton = ({ className }: { className?: string }) => {
    return (
        <div className={className}>
            <CommentHeaderSkeleton />
            <CommentBodySkeleton />
            <CommentFooterSkeleton />
        </div>
    )
}
