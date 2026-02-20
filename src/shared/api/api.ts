import {
    BaseQueryFn,
    FetchArgs,
    FetchBaseQueryError,
    createApi,
    fetchBaseQuery
} from '@reduxjs/toolkit/query/react'

const baseQuery = fetchBaseQuery({ baseUrl: '/api' })

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
    args,
    api,
    extraOptions
) => {
    let result = await baseQuery(args, api, extraOptions)
    const isRefreshUrl = typeof args === 'object' && 'url' in args && args.url === '/refresh'

    if (result.error && result.error.status === 401 && !isRefreshUrl) {
        const refresh = await baseQuery(
            { url: '/refresh', credentials: 'include', method: 'POST' },
            api,
            extraOptions
        )
        if (refresh.data) {
            result = await baseQuery(args, api, extraOptions)
        } else {
            api.dispatch({ type: 'user/logout' })
        }
    }

    return result
}

const api = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['User', 'Draft', 'Post', 'Comment'],
    endpoints: () => ({})
})

export default api
