import { commentActions } from '@/entities/comment'
import { postActions } from '@/entities/post'
import { api } from '@/shared/api'
import { TResponseBase } from '@/shared/types'
import { UpdateBookmarkInput } from '@/shared/validation/bookmark.schema'

export const bookmarkService = api.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        bookmark: builder.mutation<TResponseBase<null>, UpdateBookmarkInput>({
            query: (body) => ({ url: '/bookmark', body, method: 'POST', credentials: 'include' }),
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

export const { useBookmarkMutation } = bookmarkService

const buildBookmarkAction = ({ id, target }: UpdateBookmarkInput) => {
    switch (target) {
        case 'COMMENT':
            return commentActions.toggleBookmarked({ id })
        case 'POST':
            return postActions.toggleBookmarked({ id })
        default: {
            throw Error(`Unknown bookmark target: ${target satisfies never}`)
        }
    }
}
