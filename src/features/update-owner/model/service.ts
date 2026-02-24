import { authActions } from '@/entities/auth'
import { userActions } from '@/entities/user'
import { api } from '@/shared/api'
import { TResponseBase } from '@/shared/types'
import { TUser } from '@/shared/types/user.types'
import { PatchUserSchemaInput } from '@/shared/validation/user.schema'

export const updateOwnerService = api.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        updateOwner: builder.mutation<TResponseBase<TUser>, PatchUserSchemaInput>({
            query: (body) => ({
                url: '/users',
                body,
                method: 'POST',
                credentials: 'include'
            }),
            onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
                const user = (await queryFulfilled)?.data.result
                dispatch(userActions.setOne(user))
                dispatch(authActions.setUser(user))
            }
        })
    })
})

export const { useUpdateOwnerMutation } = updateOwnerService
