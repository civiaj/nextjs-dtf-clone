import { api } from '@/shared/api'
import { TResponseBase } from '@/shared/types'
import { TReactionAssets } from '@/shared/types/reaction.types'

export const assetsService = api.injectEndpoints({
    endpoints: (builder) => ({
        getAssets: builder.query<TResponseBase<{ reactions: TReactionAssets }>, void>({
            query: () => ({
                url: '/assets',
                method: 'GET',
                credentials: 'include'
            })
        })
    })
})

export const { useGetAssetsQuery } = assetsService
