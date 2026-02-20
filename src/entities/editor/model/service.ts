import { LinkToolData } from '@/entities/editor'
import { postActions } from '@/entities/post'
import { api } from '@/shared/api'
import { TResponseBase } from '@/shared/types'
import { TPost } from '@/shared/types/post.types'
import { PublishPostInput, UpdatePostInput } from '@/shared/validation/post.schema'

export const editorService = api.injectEndpoints({
    endpoints: (builder) => ({
        getLinkPreview: builder.query<TResponseBase<LinkToolData>, string>({
            query: (url) => ({
                url: '/editor/link',
                method: 'GET',
                credentials: 'include',
                params: { url }
            })
        }),
        update: builder.mutation<TResponseBase<TPost>, UpdatePostInput>({
            query: (body) => ({
                url: `/editor/update`,
                body,
                method: 'POST',
                credentials: 'include'
            }),
            onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
                const result = await queryFulfilled
                const changes = result.data.result
                dispatch(postActions.updateOne({ changes, id: changes.id }))
            }
        }),
        publish: builder.mutation<TResponseBase<TPost>, PublishPostInput>({
            query: (body) => ({
                url: `/editor/publish`,
                body,
                credentials: 'include',
                method: 'POST'
            }),
            onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
                const result = await queryFulfilled
                const changes = result.data.result
                dispatch(postActions.updateOne({ changes, id: changes.id }))
            }
        })
    })
})

export const { useGetLinkPreviewQuery, useUpdateMutation, usePublishMutation } = editorService
