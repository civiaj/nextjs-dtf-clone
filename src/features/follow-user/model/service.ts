import { userActions } from '@/entities/user'
import { RootState } from '@/lib/store'
import { api } from '@/shared/api'
import { TResponseBase } from '@/shared/types'
import { UpdateUserFollowInput } from '@/shared/validation/follow.schema'

export const followUserService = api.injectEndpoints({
    endpoints: (builder) => ({
        followUser: builder.mutation<TResponseBase<null>, UpdateUserFollowInput>({
            query: (body) => ({
                url: `/follow`,
                method: 'POST',
                credentials: 'include',
                body
            }),
            onQueryStarted: async ({ id }, { dispatch, queryFulfilled, getState }) => {
                const owner = (getState() as RootState).auth.currentUser
                try {
                    dispatch(userActions.toggleFollow({ id, ownerId: owner?.id }))
                    await queryFulfilled
                } catch {
                    dispatch(userActions.toggleFollow({ id, ownerId: owner?.id }))
                }
            }
        })
    }),
    overrideExisting: true
})

export const { useFollowUserMutation } = followUserService
