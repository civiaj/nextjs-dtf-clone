import { createSlice } from '@reduxjs/toolkit'
import { TUser } from '@/shared/types/user.types'
import { authService } from './service'

type TAuthSlice = {
    staleUser: TUser | null
    currentUser: TUser | null
    isRefreshAttempted: boolean
}

const initialState: TAuthSlice = {
    staleUser: null,
    currentUser: null,
    isRefreshAttempted: false
}

const authSlice = createSlice({
    initialState,
    name: 'auth',
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addMatcher(
                (action) =>
                    authService.endpoints.getOwner.matchFulfilled(action) ||
                    authService.endpoints.updateOwner.matchFulfilled(action),
                (state, { payload }) => {
                    state.isRefreshAttempted = true
                    state.staleUser = payload.result
                    state.currentUser = payload.result
                }
            )
            .addMatcher(authService.endpoints.logout.matchFulfilled, (state) => {
                state.staleUser = null
                state.currentUser = null
            })
            .addMatcher(
                (action) =>
                    authService.endpoints.refresh.matchRejected(action) ||
                    authService.endpoints.getOwner.matchRejected(action),
                (state) => {
                    state.isRefreshAttempted = true
                    state.currentUser = null
                }
            )
    }
})

export const { actions: authActions, reducer: authReducer } = authSlice
