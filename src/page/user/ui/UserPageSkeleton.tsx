import { Container, ContainerPadding } from '@/shared/ui/box'
import { Skeleton } from '@/shared/ui/skeleton'

export const UserPageSkeleton = () => {
    return (
        <Container
            withBottom={false}
            className='overflow-hidden'>
            <div className='aspect-[3/1] bg-foreground/10' />

            <ContainerPadding className='-mt-10 flex items-end justify-between gap-2 pt-0 md:-mt-12 md:pt-0'>
                <div className='rounded-full border-4 border-secondary'>
                    <Skeleton className='h-20 w-20 rounded-full sm:h-24 sm:w-24' />
                </div>
                <Skeleton className='h-9 w-9'></Skeleton>
            </ContainerPadding>
            <ContainerPadding className='flex flex-col'>
                <Skeleton className='mb-4 mt-4 h-3 w-1/4' />
                <Skeleton className='mb-4 h-3 w-8/12' />
                <Skeleton className='mb-4 h-3 w-1/6' />
            </ContainerPadding>
            <ContainerPadding className='flex items-center justify-between gap-4'>
                <div className='flex gap-4'>
                    <Skeleton className='mb-4 mt-2 h-3 w-16' />
                    <Skeleton className='mb-4 mt-2 h-3 w-16' />
                </div>
                <Skeleton className='h-3 w-14' />
            </ContainerPadding>
        </Container>
    )
}
