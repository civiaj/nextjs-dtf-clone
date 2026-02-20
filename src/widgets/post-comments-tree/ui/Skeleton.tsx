import { CommentItemSkeleton } from '@/entities/comment'

export const Skeleton = () => {
    return Array.from({ length: 10 }).map((_, i) => (
        <CommentItemSkeleton
            className='px-3 pt-3 sm:px-6 sm:pt-6'
            key={i}
        />
    ))
}
