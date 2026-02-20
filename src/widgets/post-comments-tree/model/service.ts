import { commentActions } from '@/entities/comment'
import { userActions } from '@/entities/user'
import { api } from '@/shared/api'
import { GetCommentsResponse } from '@/shared/types/comment.types'
import { GetPostCommentsClientQueryArgs } from '../types'
import { commentsTreeActions } from './slice'

export const commentsTreeService = api.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        getPostComments: builder.infiniteQuery<
            GetCommentsResponse,
            GetPostCommentsClientQueryArgs,
            { cursor?: number }
        >({
            query: ({ pageParam, queryArg: { uiThreadId: _, ...queryArg } }) => ({
                url: '/comment',
                params: { ...pageParam, ...queryArg },
                method: 'GET',
                credentials: 'include'
            }),
            infiniteQueryOptions: {
                initialPageParam: {},
                getNextPageParam: ({ result: { cursor } }) => {
                    if (!cursor) return
                    return { cursor }
                }
            },
            onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
                try {
                    const result = await queryFulfilled
                    const comments = result.data.pages.flatMap((page) => page.result.items)
                    dispatch(commentActions.setMany(comments))
                    dispatch(userActions.setMany(comments.map((c) => c.user)))
                    dispatch(commentsTreeActions.applyCommentsBatch(comments))
                } catch {}
            }
        })
    })
})

export const { useGetPostCommentsInfiniteQuery } = commentsTreeService
