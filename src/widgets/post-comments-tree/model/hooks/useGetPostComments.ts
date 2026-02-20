import { useMemo } from 'react'
import { useIsAuthReadyForQueries } from '@/entities/auth'
import { makeSelectPost } from '@/entities/post'
import { useAppSelector } from '@/lib/store'
import { TComment } from '@/shared/types/comment.types'
import { TPost } from '@/shared/types/post.types'
import { GetPostCommentsClientQueryArgs } from '../../types'
import { useGetPostCommentsInfiniteQuery } from '../service'
import { useThreadQueryParam } from './useThreadQueryParam'

export const useGetPostComments = ({
    cursor,
    parentId,
    postId,
    enabled = true,
    fallbackCommentCount = 0
}: {
    postId?: TPost['id']
    cursor?: number
    parentId?: TComment['parentId']
    enabled?: boolean
    fallbackCommentCount?: number
} = {}) => {
    const uiThreadId = useThreadQueryParam() ?? null

    const storePostId = useAppSelector((state) => state.commentsTree.postId)
    const effectivePostId = postId ?? storePostId

    const selectPost = useMemo(makeSelectPost, [])
    const post = useAppSelector((state) => selectPost(state, effectivePostId))
    const sortBy = useAppSelector((state) => state.commentsTree.sortBy)
    const currentUser = useAppSelector((state) => state.auth.currentUser)
    const isReady = useIsAuthReadyForQueries()

    const isThreadMode = uiThreadId != null
    const isLoadMore = cursor != null || parentId != null

    const args: GetPostCommentsClientQueryArgs = useMemo(() => {
        if (!effectivePostId) throw new Error('useGetPostComments | Post id is required')

        if (isThreadMode && !isLoadMore) {
            return {
                type: 'thread',
                postId: effectivePostId,
                threadId: uiThreadId!,
                uiThreadId: uiThreadId!
            }
        }

        return {
            type: 'post',
            postId: effectivePostId,
            sortBy,
            cursor,
            parentId,
            uiThreadId
        }
    }, [effectivePostId, isThreadMode, isLoadMore, uiThreadId, sortBy, cursor, parentId])

    const skip =
        !enabled ||
        !isReady ||
        (!!currentUser && !post) ||
        (!!currentUser && !!post && post.user.isMutedMe)

    const query = useGetPostCommentsInfiniteQuery(args, { refetchOnMountOrArgChange: true, skip })

    return {
        ...query,
        isMutedByUser: post?.user.isMutedMe ?? false,
        isSkeletonVisible: query.isLoading || query.isFetching || skip,
        commentCount: post?.commentCount ?? fallbackCommentCount
    }
}
