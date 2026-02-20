import { postActions } from '@/entities/post'
import { userActions } from '@/entities/user'
import { api } from '@/shared/api'
import { TResponseBase } from '@/shared/types'
import { TPageResult } from '@/shared/types/common.types'
import { TPost } from '@/shared/types/post.types'
import { TReactionMetrics } from '@/shared/types/reaction.types'
import { TGetAllReactionsInput, TUpdateReactionInput } from '@/shared/validation/reaction.schema'

export const reactionPostService = api.injectEndpoints({
    endpoints: (builder) => ({
        updatePostReaction: builder.mutation<
            TResponseBase<TReactionMetrics>,
            Omit<TUpdateReactionInput, 'target'>
        >({
            query: (payload) => {
                const body: TUpdateReactionInput = { ...payload, target: 'POST' }
                return {
                    url: '/reaction',
                    body,
                    method: 'POST',
                    credentials: 'include'
                }
            },
            onQueryStarted: async (
                { reactionValueId, targetId: id },
                { dispatch, queryFulfilled }
            ) => {
                try {
                    dispatch(postActions.toggleReaction({ id, reactionValueId }))
                    const reactions = (await queryFulfilled).data.result.reactions
                    dispatch(postActions.setReactions({ id, reactions }))
                } catch {
                    dispatch(postActions.toggleReaction({ id, reactionValueId }))
                }
            }
        }),
        getAllReactedPosts: builder.infiniteQuery<
            TResponseBase<TPageResult<TPost>>,
            Omit<TGetAllReactionsInput, 'target'>,
            { cursor?: number }
        >({
            infiniteQueryOptions: {
                initialPageParam: {},
                getNextPageParam: ({ result: { cursor } }) => {
                    if (!cursor) return
                    return { cursor }
                }
            },
            query: ({ queryArg, pageParam }) => {
                const params: TGetAllReactionsInput = { ...pageParam, ...queryArg, target: 'POST' }
                return {
                    url: '/reaction',
                    params,
                    method: 'GET',
                    credentials: 'include'
                }
            },

            onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
                const result = await queryFulfilled
                const posts = result.data.pages.flatMap((page) => page.result.items)
                dispatch(postActions.setMany(posts))
                dispatch(userActions.setMany(posts.map((c) => c.user)))
            }
        })
    })
})

export const { useUpdatePostReactionMutation, useGetAllReactedPostsInfiniteQuery } =
    reactionPostService
