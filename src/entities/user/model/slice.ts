import {
    createDraftSafeSelector,
    createEntityAdapter,
    createSlice,
    EntityState,
    PayloadAction
} from '@reduxjs/toolkit'
import { RootState } from '@/lib/store'
import { TUser } from '@/shared/types/user.types'

const adapter = createEntityAdapter({ selectId: (user: TUser) => user.id })
const data = adapter.getInitialState()
const initialState: UserSliceState = {
    data
}

const userSlice = createSlice({
    initialState,
    name: 'user',
    reducers: {
        setMany(state, action: PayloadAction<TUser[]>) {
            adapter.setMany(state.data, action.payload)
        },

        setOne(state, action: PayloadAction<TUser>) {
            adapter.setOne(state.data, action.payload)
        },

        updateOne(state, action: PayloadAction<{ id: TUser['id']; changes: Partial<TUser> }>) {
            const { changes, id } = action.payload
            adapter.updateOne(state.data, { changes, id })
        },

        toggleFollow(
            state,
            action: PayloadAction<{ id: TUser['id']; ownerId: TUser['id'] | undefined }>
        ) {
            const { id, ownerId } = action.payload
            const user = state.data.entities[id]

            if (!user) return

            const isFollowed = user.isFollowed
            const delta = isFollowed ? -1 : 1
            user.isFollowed = !isFollowed
            user.followersCount += delta

            if (!ownerId) return

            const owner = state.data.entities[ownerId]

            if (!owner) return

            owner.followersCount += delta
        },

        toggleMuted(state, action: PayloadAction<{ id: TUser['id'] }>) {
            const { id } = action.payload
            const user = state.data.entities[id]

            if (!user) return

            user.isMuted = !user.isMuted
        }
    }
})

export const { actions: userActions, reducer: userReducer } = userSlice

export const selectUser = createDraftSafeSelector(
    [(state: RootState) => state.user, (_: RootState, id: number) => id],
    (state, id) => state.data.entities[id]
)

type UserSliceState = {
    data: EntityState<TUser, number>
}
