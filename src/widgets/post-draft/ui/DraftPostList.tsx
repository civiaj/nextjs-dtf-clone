'use client'

import { InfiniteVList } from '@/components/VList'
import { useIsAuthReadyForQueries } from '@/entities/auth'
import { PostEntityListSkeleton, useGetPostAllInfiniteQuery } from '@/entities/post'
import { useAppSelector } from '@/lib/store'
import { DraftPostItem } from './DraftPostItem'

export const DraftPostList = () => {
    const isAuthReady = useIsAuthReadyForQueries()
    const clientDeletedIds = useAppSelector((state) => state.post.clientDeletedIds)
    const { data, fetchNextPage, isLoading, isFetching, isError, error, isSuccess, hasNextPage } =
        useGetPostAllInfiniteQuery(
            { type: 'owner-drats' },
            { skip: !isAuthReady, refetchOnMountOrArgChange: true }
        )
    const ids = data?.pages.flatMap((p) => p.result.items.map((i) => i.id)) ?? []
    const visibleIds = ids.filter((id) => !clientDeletedIds[id])

    return (
        <InfiniteVList
            count={visibleIds.length}
            error={error}
            isLoading={isLoading || isFetching}
            hasNextPage={hasNextPage}
            onScrollEnd={fetchNextPage}
            estimateSize={() => 300}
            isError={isError}
            isSuccess={isSuccess}
            renderItem={({ index }) => (
                <DraftPostItem
                    id={visibleIds[index]}
                    view='cover'
                />
            )}
            Skeleton={<PostEntityListSkeleton />}
        />
    )
}
