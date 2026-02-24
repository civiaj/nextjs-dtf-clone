import { api } from '@/shared/api'
import { TResponseBase } from '@/shared/types'
import { TUser } from '@/shared/types/user.types'
import { LoginSchemaInput, SignUpSchemaInput } from '@/shared/validation/user.schema'

export const authService = api.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<TResponseBase<TUser>, LoginSchemaInput>({
            query: (body) => ({
                url: '/login',
                body,
                method: 'POST'
            })
        }),
        logout: builder.mutation<void, void>({
            query: () => ({
                url: '/logout',
                credentials: 'include',
                method: 'POST'
            })
        }),
        signup: builder.mutation<TResponseBase<TUser>, SignUpSchemaInput>({
            query: (body) => ({
                url: '/signup',
                body,
                method: 'POST'
            })
        }),
        refresh: builder.query<TResponseBase<TUser>, void>({
            query: () => ({
                url: '/refresh',
                method: 'POST',
                credentials: 'include'
            }),
            onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
                await queryFulfilled
                dispatch(authService.endpoints.getOwner.initiate())
            }
        }),
        getOwner: builder.query<TResponseBase<TUser>, void>({
            query: () => ({
                url: '/me',
                method: 'GET',
                credentials: 'include'
            })
        })
    }),
    overrideExisting: true
})

export const {
    useGetOwnerQuery,
    useLazyGetOwnerQuery,
    useLoginMutation,
    useSignupMutation,
    useRefreshQuery,
    useLogoutMutation
} = authService
