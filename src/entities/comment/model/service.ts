import { postActions } from '@/entities/post'
import { userActions } from '@/entities/user'
import { api } from '@/shared/api'
import { TResponseBase } from '@/shared/types'
import { TComment } from '@/shared/types/comment.types'
import { TPageResult } from '@/shared/types/common.types'
import {
    CreateCommentInput,
    GetBookmarkedCommentsInput,
    GetReactedCommentsInput,
    GetUserCommentsInput
} from '@/shared/validation/comment.schema'
import { commentActions } from './slice'

export const commentService = api.injectEndpoints({
    endpoints: (builder) => ({
        saveComment: builder.mutation<TResponseBase<TComment>, CreateCommentInput>({
            query: (body) => ({
                url: '/comment',
                body,
                method: 'POST',
                credentials: 'include'
            }),
            onQueryStarted: async ({ postId }, { dispatch, queryFulfilled }) => {
                try {
                    const { data } = await queryFulfilled
                    dispatch(commentActions.setOne(data.result))
                    dispatch(postActions.setCommentCount({ id: postId, delta: 1 }))
                } catch {}
            }
        }),
        deleteComment: builder.mutation<TResponseBase<TComment>, { id: TComment['id'] }>({
            query: (body) => ({
                url: `/comment`,
                method: 'DELETE',
                credentials: 'include',
                body
            }),
            onQueryStarted: async ({ id }, { dispatch, queryFulfilled }) => {
                try {
                    dispatch(commentActions.toggleRemoveOne({ id }))
                    await queryFulfilled
                } catch {
                    dispatch(commentActions.toggleRemoveOne({ id }))
                }
            }
        }),
        getComments: builder.infiniteQuery<
            TResponseBase<TPageResult<TComment>>,
            GetUserCommentsInput | GetReactedCommentsInput | GetBookmarkedCommentsInput,
            { cursor?: number }
        >({
            query: ({ pageParam, queryArg }) => ({
                url: '/comment',
                method: 'GET',
                params: { ...pageParam, ...queryArg },
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
                } catch {}
            }
        })
    })
})

export const { useSaveCommentMutation, useDeleteCommentMutation, useGetCommentsInfiniteQuery } =
    commentService
