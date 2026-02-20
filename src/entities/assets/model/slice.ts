import { createSlice } from '@reduxjs/toolkit'
import { assetsService } from '@/entities/assets/model/service'
import { TReaction } from '@/shared/types/reaction.types'

const initialState: TAssetsSlice = {
    reactions: [],
    defaultReactionValue: null
}

export const assetsSlice = createSlice({
    name: 'assets',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addMatcher(
            assetsService.endpoints.getAssets.matchFulfilled,
            (state, { payload }) => {
                state.reactions = payload.result.reactions.items
                state.defaultReactionValue = payload.result.reactions.defaultValue
            }
        )
    }
})

export const { actions: assetsActions, reducer: assetsReducer } = assetsSlice

type TAssetsSlice = { reactions: TReaction[]; defaultReactionValue: TReaction | null }
