'use client'

import { ReactNode, useMemo } from 'react'
import { InfiniteVList } from '@/components/VList'
import { useIsAuthReadyForQueries } from '@/entities/auth'
import { PostEntityListSkeleton, useGetPostAllInfiniteQuery } from '@/entities/post'
import { useAppSelector } from '@/lib/store'
import { TPost } from '@/shared/types/post.types'
import {
    GetOwnerBookmaredPostsInput,
    GetFeedPostsInput,
    GetOwnerReactedPostsInput,
    GetUserPostsInput,
    GetOwnerMutedPostsInput
} from '@/shared/validation/post.schema'
import { PublishedPostItem } from './PublishedPostItem'

type PublishedPostListArgs = (
    | GetUserPostsInput
    | GetFeedPostsInput
    | GetOwnerBookmaredPostsInput
    | GetOwnerReactedPostsInput
    | GetOwnerMutedPostsInput
) & {
    action?: ReactNode | ((post: TPost) => ReactNode)
    showDefaultHeaderActions?: boolean
}

export const PublishedPostList = ({
    action,
    showDefaultHeaderActions,
    ...args
}: PublishedPostListArgs) => {
    const isAuthReady = useIsAuthReadyForQueries()
    const entities = useAppSelector((state) => state.post.data.entities)
    const { data, fetchNextPage, isLoading, isFetching, isError, error, isSuccess, hasNextPage } =
        useGetPostAllInfiniteQuery(args, { skip: !isAuthReady })
    const ids = useMemo(
        () => data?.pages.flatMap((p) => p.result.items.map((i) => i.id)) ?? [],
        [data]
    )
    const visibleIds = useMemo(() => {
        if (args.type !== 'owner-muted-posts') return ids
        return ids.filter((id) => entities[id]?.isMuted !== false)
    }, [ids, entities, args.type])

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
                <PublishedPostItem
                    id={visibleIds[index]}
                    view='cover'
                    action={action}
                    showDefaultHeaderActions={showDefaultHeaderActions}
                />
            )}
            Skeleton={<PostEntityListSkeleton />}
        />
    )
}
