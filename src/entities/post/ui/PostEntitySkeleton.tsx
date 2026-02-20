import { Container, ContainerPadding } from '@/shared/ui/box'
import { Skeleton } from '@/shared/ui/skeleton'

export type TPostEntityRenderView = 'full' | 'cover'

const PostEntitySkeletonBody = ({ isFullView }: { isFullView: boolean }) => {
    return (
        <ContainerPadding>
            <div className='flex'>
                <div className='flex flex-1 items-center gap-2 pb-4'>
                    <Skeleton className='h-10 w-10 shrink-0 rounded-full' />
                    <div className='flex flex-1 flex-col gap-1'>
                        <Skeleton className='h-3 w-1/5' />
                        <Skeleton className='h-3 w-1/6' />
                    </div>
                </div>
                <Skeleton className='h-3 w-6 rounded-full' />
            </div>
            <div className='flex flex-col gap-2 pb-6'>
                <Skeleton className='h-3 w-10/12' />
                <Skeleton className='h-3 w-1/2' />
                <Skeleton className='h-3 w-full' />
            </div>

            {isFullView ? (
                <>
                    <div className='mb-6 flex flex-col gap-2'>
                        <Skeleton className='h-3 w-10/12' />
                        <Skeleton className='h-3 w-[70%]' />
                        <Skeleton className='h-3 w-[65%]' />
                        <Skeleton className='h-3 w-1/2' />
                    </div>
                    <div className='flex flex-col gap-2 pb-6'>
                        <Skeleton className='h-3 w-10/12' />
                        <Skeleton className='h-3 w-1/2' />
                        <Skeleton className='h-3 w-full' />
                    </div>
                    <div className='mb-6 flex flex-col gap-2'>
                        <Skeleton className='h-3 w-10/12' />
                        <Skeleton className='h-3 w-[70%]' />
                        <Skeleton className='h-3 w-[65%]' />
                        <Skeleton className='h-3 w-1/2' />
                    </div>
                    <div className='mb-6 flex flex-col gap-2'>
                        <Skeleton className='h-3 w-10/12' />
                        <Skeleton className='h-3 w-[70%]' />
                        <Skeleton className='h-3 w-[65%]' />
                        <Skeleton className='h-3 w-1/2' />
                    </div>
                    <div className='flex flex-col gap-2 pb-6'>
                        <Skeleton className='h-3 w-10/12' />
                        <Skeleton className='h-3 w-1/2' />
                        <Skeleton className='h-3 w-full' />
                    </div>
                    <div className='mb-6 flex flex-col gap-2'>
                        <Skeleton className='h-3 w-10/12' />
                        <Skeleton className='h-3 w-[70%]' />
                        <Skeleton className='h-3 w-[65%]' />
                        <Skeleton className='h-3 w-1/2' />
                    </div>
                </>
            ) : null}

            <div className='mb-6 flex flex-col gap-2'>
                <Skeleton className='h-3 w-10/12' />
                <Skeleton className='h-3 w-[70%]' />
                <Skeleton className='h-3 w-[65%]' />
                <Skeleton className='h-3 w-1/2' />
            </div>

            <div className='flex gap-2'>
                <Skeleton className='h-3 w-12' />
                <Skeleton className='h-3 w-12' />
                <Skeleton className='h-3 w-12' />
            </div>
        </ContainerPadding>
    )
}

export const PostEntitySkeleton = ({ view }: { view: TPostEntityRenderView }) => {
    return (
        <Container>
            <PostEntitySkeletonBody isFullView={view === 'full'} />
        </Container>
    )
}

export const PostEntityListSkeleton = ({ count = 3 }: { count?: number }) => {
    return Array.from({ length: count }, (_, index) => (
        <PostEntitySkeleton
            key={index}
            view='cover'
        />
    ))
}
