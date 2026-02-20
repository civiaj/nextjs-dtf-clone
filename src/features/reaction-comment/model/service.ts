import { commentActions } from '@/entities/comment'
import { userActions } from '@/entities/user'
import { api } from '@/shared/api'
import { TResponseBase } from '@/shared/types'
import { TComment } from '@/shared/types/comment.types'
import { TPageResult } from '@/shared/types/common.types'
import { TReactionMetrics } from '@/shared/types/reaction.types'
import { TGetAllReactionsInput, TUpdateReactionInput } from '@/shared/validation/reaction.schema'

export const reactionCommentService = api.injectEndpoints({
    endpoints: (builder) => ({
        updateCommentReaction: builder.mutation<
            TResponseBase<TReactionMetrics>,
            Omit<TUpdateReactionInput, 'target'>
        >({
            query: (payload) => {
                const body: TUpdateReactionInput = { ...payload, target: 'COMMENT' }
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
                    dispatch(commentActions.toggleReaction({ id, reactionValueId }))
                    const reactions = (await queryFulfilled).data.result.reactions
                    dispatch(commentActions.setReactions({ id, reactions }))
                } catch {
                    dispatch(commentActions.toggleReaction({ id, reactionValueId }))
                }
            }
        }),
        getAllReactedComments: builder.infiniteQuery<
            TResponseBase<TPageResult<TComment>>,
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
                const params: TGetAllReactionsInput = {
                    ...pageParam,
                    ...queryArg,
                    target: 'COMMENT'
                }
                return {
                    url: '/reaction',
                    params,
                    method: 'GET',
                    credentials: 'include'
                }
            },

            onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
                const result = await queryFulfilled
                const comments = result.data.pages.flatMap((page) => page.result.items)
                dispatch(commentActions.setMany(comments))
                dispatch(userActions.setMany(comments.map((c) => c.user)))
            }
        })
    })
})

export const { useGetAllReactedCommentsInfiniteQuery, useUpdateCommentReactionMutation } =
    reactionCommentService
