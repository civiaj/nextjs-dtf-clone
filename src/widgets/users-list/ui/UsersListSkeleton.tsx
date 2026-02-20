import { Container, ContainerPadding } from '@/shared/ui/box'
import { Skeleton } from '@/shared/ui/skeleton'

type UsersListSkeletonVariant = 'plain' | 'container'

const UserListItemSkeletonContent = ({ isCompact = false }: { isCompact?: boolean }) => {
    return (
        <ContainerPadding className={isCompact ? 'py-2 sm:py-3' : undefined}>
            <div className='flex items-center gap-3'>
                <Skeleton className='h-8 w-8 shrink-0 rounded-full sm:h-9 sm:w-9' />
                <div className='flex min-w-0 flex-1 flex-col gap-1'>
                    <Skeleton className='h-3 w-1/3' />
                    <Skeleton className='h-3 w-2/3' />
                </div>
            </div>
        </ContainerPadding>
    )
}

const UserListItemSkeleton = ({ variant }: { variant: UsersListSkeletonVariant }) => {
    if (variant === 'container') {
        return (
            <Container className='relative w-full overflow-hidden'>
                <UserListItemSkeletonContent />
            </Container>
        )
    }

    return (
        <div className='relative w-full overflow-hidden'>
            <UserListItemSkeletonContent isCompact />
        </div>
    )
}

export const UsersListSkeleton = ({
    count = 5,
    variant = 'plain'
}: {
    count?: number
    variant?: UsersListSkeletonVariant
}) => {
    return Array.from({ length: count }, (_, index) => (
        <UserListItemSkeleton
            key={index}
            variant={variant}
        />
    ))
}
