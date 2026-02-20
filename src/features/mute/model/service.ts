import { postActions } from '@/entities/post'
import { userActions } from '@/entities/user'
import { api } from '@/shared/api'
import { TResponseBase } from '@/shared/types'
import { CreateMuteInput } from '@/shared/validation/mute.schema'

export const muteService = api.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        mute: builder.mutation<TResponseBase<null>, CreateMuteInput>({
            query: (body) => ({
                url: '/mute',
                body,
                method: 'POST',
                credentials: 'include'
            }),
            onQueryStarted: async (input, { dispatch, queryFulfilled }) => {
                const action = buildBookmarkAction(input)
                try {
                    dispatch(action)
                    await queryFulfilled
                } catch {
                    dispatch(action)
                }
            }
        })
    })
})

export const { useMuteMutation } = muteService

const buildBookmarkAction = ({ target, targetId: id }: CreateMuteInput) => {
    switch (target) {
        case 'USER':
            return userActions.toggleMuted({ id })
        case 'POST':
            return postActions.toggleMuted({ id })
        default: {
            throw Error(`Unknown bookmark target: ${target satisfies never}`)
        }
    }
}
