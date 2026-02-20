import { userActions } from '@/entities/user'
import { api } from '@/shared/api'
import { TResponseBase } from '@/shared/types'
import { TPost } from '@/shared/types/post.types'
import { GetPostsInput } from '@/shared/validation/post.schema'
import { postActions } from './slice'

export const postService = api.injectEndpoints({
    endpoints: (builder) => ({
        getPost: builder.query<TResponseBase<TPost>, TPost['id']>({
            query: (id) => ({
                url: `/posts/${id}`,
                method: 'GET',
                credentials: 'include'
            }),
            onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
                const result = await queryFulfilled
                dispatch(userActions.setOne(result.data.result.user))
                dispatch(postActions.setOne(result.data.result))
            }
        }),
        getPostAll: builder.infiniteQuery<
            TResponseBase<{ items: TPost[]; cursor?: number }>,
            GetPostsInput,
            { cursor?: number }
        >({
            query: ({ pageParam, queryArg }) => ({
                url: '/posts',
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
                const result = await queryFulfilled
                const posts = result.data.pages.flatMap((page) => page.result.items)
                const users = posts.map((p) => p.user)
                dispatch(postActions.setMany(posts))
                dispatch(userActions.setMany(users))
            }
        }),
        deletePost: builder.mutation<TResponseBase<TPost>, TPost['id']>({
            query: (id) => ({
                url: `/posts?id=${id}`,
                method: 'DELETE',
                credentials: 'include'
            }),
            onQueryStarted: async (id, { dispatch, queryFulfilled }) => {
                await queryFulfilled
                dispatch(postActions.removeOne(id))
            }
        })
    })
})

export const {
    useGetPostQuery,
    useLazyGetPostQuery,
    useGetPostAllInfiniteQuery,
    useDeletePostMutation
} = postService
