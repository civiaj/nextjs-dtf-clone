'use client'

import { InfiniteVList } from '@/components/VList'
import { useIsAuthReadyForQueries } from '@/entities/auth'
import { PostEntityListSkeleton, useGetPostAllInfiniteQuery } from '@/entities/post'
import {
    GetOwnerBookmaredPostsInput,
    GetFeedPostsInput,
    GetOwnerReactedPostsInput,
    GetUserPostsInput,
    GetOwnerMutedPostsInput
} from '@/shared/validation/post.schema'
import { PublishedPostItem } from './PublishedPostItem'

export const PublishedPostList = (
    args:
        | GetUserPostsInput
        | GetFeedPostsInput
        | GetOwnerBookmaredPostsInput
        | GetOwnerReactedPostsInput
        | GetOwnerMutedPostsInput
) => {
    const isAuthReady = useIsAuthReadyForQueries()
    const { data, fetchNextPage, isLoading, isFetching, isError, error, isSuccess, hasNextPage } =
        useGetPostAllInfiniteQuery(args, { skip: !isAuthReady })
    const ids = data?.pages.flatMap((p) => p.result.items.map((i) => i.id)) ?? []

    return (
        <InfiniteVList
            count={ids.length}
            error={error}
            isLoading={isLoading || isFetching}
            hasNextPage={hasNextPage}
            onScrollEnd={fetchNextPage}
            estimateSize={() => 300}
            isError={isError}
            isSuccess={isSuccess}
            renderItem={({ index }) => (
                <PublishedPostItem
                    id={ids[index]}
                    view='cover'
                />
            )}
            Skeleton={<PostEntityListSkeleton />}
        />
    )
}
