'use client'

import { InfiniteVList, InfiniteVListProps } from '@/components/VList'
import { GetUsersInput } from '@/shared/validation/user.schema'
import { UserListItem, UserListItemInContainer, UserListItemProps } from './UserListItem'
import { UsersListSkeleton } from './UsersListSkeleton'
import { useUserListData } from '../hooks/useUserListData'

type UsersListItemVariant = 'plain' | 'container'

export const UsersList = ({
    mode = 'window',
    action,
    itemVariant = 'plain',
    ...args
}: GetUsersInput &
    Pick<InfiniteVListProps, 'mode'> &
    Pick<UserListItemProps, 'action'> & {
        itemVariant?: UsersListItemVariant
    }) => {
    const UserItemComponent = itemVariant === 'container' ? UserListItemInContainer : UserListItem
    const { ids, error, hasNextPage, fetchNextPage, isSuccess, isError, isFetching, isLoading } =
        useUserListData(args)

    if (mode === 'container') {
        return (
            <InfiniteVList
                containerClassName='h-auto max-h-[80vh]'
                mode='container'
                count={ids.length}
                error={error}
                isLoading={isLoading || isFetching}
                hasNextPage={hasNextPage}
                onScrollEnd={fetchNextPage}
                estimateSize={() => 56}
                isError={isError}
                isSuccess={isSuccess}
                renderItem={({ index }) => (
                    <UserItemComponent
                        id={ids[index]}
                        action={action}
                    />
                )}
                Skeleton={<UsersListSkeleton variant={itemVariant} />}
            />
        )
    }

    return (
        <InfiniteVList
            mode='window'
            count={ids.length}
            error={error}
            isLoading={isLoading || isFetching}
            hasNextPage={hasNextPage}
            onScrollEnd={fetchNextPage}
            estimateSize={() => 56}
            isError={isError}
            isSuccess={isSuccess}
            renderItem={({ index }) => (
                <UserItemComponent
                    id={ids[index]}
                    action={action}
                />
            )}
            Skeleton={<UsersListSkeleton variant={itemVariant} />}
        />
    )
}
