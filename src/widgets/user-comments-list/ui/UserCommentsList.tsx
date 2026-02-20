'use client'

import { InfiniteVList } from '@/components/VList'
import { useIsAuthReadyForQueries } from '@/entities/auth'
import { useGetCommentsInfiniteQuery } from '@/entities/comment'
import {
    GetBookmarkedCommentsInput,
    GetReactedCommentsInput,
    GetUserCommentsInput
} from '@/shared/validation/comment.schema'
import { UserCommentItem } from './UserCommentItem'
import { UserCommentsListSkeleton } from './UserCommentsListSkeleton'

export const UserCommentsList = (
    args: GetUserCommentsInput | GetReactedCommentsInput | GetBookmarkedCommentsInput
) => {
    const isAuthReady = useIsAuthReadyForQueries()
    const { data, fetchNextPage, isLoading, isFetching, isError, error, isSuccess, hasNextPage } =
        useGetCommentsInfiniteQuery(args, { skip: !isAuthReady })
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
            renderItem={({ index }) => <UserCommentItem id={ids[index]} />}
            Skeleton={<UserCommentsListSkeleton />}
        />
    )
}
