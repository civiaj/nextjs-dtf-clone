import { PostEntityListSkeleton } from '@/entities/post'
import { Container, ContainerPadding } from '@/shared/ui/box'
import { Skeleton } from '@/shared/ui/skeleton'

export const MainPageSkeleton = () => {
    return (
        <div className='no-radius-first-container no-radius-first-skeleton'>
            <Container
                className='mb-0 border-b border-border md:mb-0 md:rounded-bl-none md:rounded-br-none'
                withBottom={false}>
                <ContainerPadding
                    withTop={false}
                    className='flex h-9 items-center justify-between gap-4 sm:h-14'>
                    <Skeleton className='h-3 w-1/3' />
                    <Skeleton className='h-3 w-8' />
                </ContainerPadding>
            </Container>
            <PostEntityListSkeleton />
        </div>
    )
}
