import {
    BaseQueryFn,
    FetchArgs,
    FetchBaseQueryError,
    QueryActionCreatorResult,
    QueryDefinition
} from '@reduxjs/toolkit/query'
import { userActions } from '@/entities/user/model/slice'
import { _store } from '@/lib/store'
import { api } from '@/shared/api'
import { TResponseBase } from '@/shared/types'
import { ResponseBase } from '@/shared/types/common.types'
import { TUser } from '@/shared/types/user.types'
import { GetUsersInput } from '@/shared/validation/user.schema'

export const userService = api.injectEndpoints({
    endpoints: (builder) => ({
        getUser: builder.query<ResponseBase<TUser>, TUser['id']>({
            query: (id) => ({
                url: `/${id}/user`,
                method: 'GET',
                credentials: 'include'
            }),
            onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
                const result = await queryFulfilled
                dispatch(userActions.setOne(result.data.result))
            },
            keepUnusedDataFor: 0
        }),
        getUsers: builder.infiniteQuery<
            TResponseBase<{ items: TUser[]; cursor?: number }>,
            GetUsersInput,
            { cursor?: number }
        >({
            query: ({ pageParam, queryArg }) => ({
                url: '/users',
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
                const users = result.data.pages.flatMap((page) => page.result.items)
                dispatch(userActions.setMany(users))
            }
        }),
        getSuggestions: builder.query<ResponseBase<TUser[]>, string>({
            query: (query) => ({
                url: `/mentions?query=${query}`,
                method: 'GET',
                credentials: 'include'
            })
        })
    })
})

export const { useGetUserQuery, useGetSuggestionsQuery, useGetUsersInfiniteQuery } = userService

let timeoutId: ReturnType<typeof setTimeout> | null = null
let lastRequest: QueryActionCreatorResult<
    QueryDefinition<
        string,
        BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>,
        'User' | 'Draft' | 'Post' | 'Comment',
        ResponseBase<TUser[]>,
        'api'
    >
> | null = null

export const fetchSuggestions = async (query: string): Promise<TUser[]> => {
    if (!_store) return []

    const { currentUser } = _store.getState().auth ?? {}
    if (!currentUser || !query.trim()) return []
    if (timeoutId) clearTimeout(timeoutId)

    return new Promise((resolve) => {
        timeoutId = setTimeout(async () => {
            lastRequest?.abort()
            if (!_store) return resolve([])
            lastRequest = _store.dispatch(
                userService.endpoints.getSuggestions.initiate(query, {
                    subscribe: false
                })
            )
            try {
                const res = await lastRequest.unwrap()
                resolve(res?.result ?? [])
            } catch {
                resolve([])
            }
        }, 250)
    })
}
