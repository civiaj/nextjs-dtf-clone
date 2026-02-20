import { createEntityAdapter, createSlice, EntityState, PayloadAction } from '@reduxjs/toolkit'
import { TPost } from '@/shared/types/post.types'
import { TReaction } from '@/shared/types/reaction.types'

const adapter = createEntityAdapter({ selectId: (post: TPost) => post.id })
const data = adapter.getInitialState()

type PostSliceState = {
    data: EntityState<TPost, number>
    clientDeletedIds: Record<TPost['id'], boolean>
}

const initialState: PostSliceState = { data, clientDeletedIds: {} }

const postSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        setMany(state, action: PayloadAction<TPost[]>) {
            adapter.setMany(state.data, action.payload)
        },

        setOne(state, action: PayloadAction<TPost>) {
            adapter.setOne(state.data, action.payload)
        },

        updateOne(state, action: PayloadAction<{ id: TPost['id']; changes: Partial<TPost> }>) {
            const { changes, id } = action.payload
            adapter.updateOne(state.data, { changes, id })
        },

        removeOne(state, action: PayloadAction<TPost['id']>) {
            adapter.removeOne(state.data, action.payload)
            state.clientDeletedIds[action.payload] = true
        },

        toggleMuted(state, action: PayloadAction<{ id: TPost['id'] }>) {
            const { id } = action.payload
            const post = state.data.entities[id]

            if (!post) return

            post.isMuted = !post.isMuted
        },

        toggleBookmarked(state, action: PayloadAction<{ id: TPost['id'] }>) {
            const { id } = action.payload
            const post = state.data.entities[id]

            if (!post) return

            const isBookmarked = post.isBookmarked
            const delta = isBookmarked ? -1 : 1

            state.data.entities[id].isBookmarked = !isBookmarked
            state.data.entities[id].bookmarkCount += delta
        },

        toggleReaction(
            state,
            action: PayloadAction<{ id: TPost['id']; reactionValueId: TReaction['id'] }>
        ) {
            const { id, reactionValueId } = action.payload
            const post = state.data.entities[id]

            if (!post) return

            const prev = post.reactions.activeReactionId
            const isSame = prev === reactionValueId
            const delta = isSame ? -1 : 1

            post.reactions.activeReactionId = isSame ? null : reactionValueId

            post.reactions.items = post.reactions.items.map((r) => {
                if (r.id === reactionValueId) {
                    return { ...r, count: r.count + delta }
                }

                if (!isSame && r.id === prev) {
                    return { ...r, count: r.count - delta }
                }

                return r
            })
        },

        setReactions(
            state,
            action: PayloadAction<{ id: TPost['id']; reactions: TPost['reactions'] }>
        ) {
            const { id, reactions } = action.payload
            const post = state.data.entities[id]

            if (!post) return

            post.reactions = reactions
        },

        setCommentCount(state, action: PayloadAction<{ id: TPost['id']; delta: number }>) {
            const { id, delta } = action.payload
            const post = state.data.entities[id]

            if (!post) return

            post.commentCount += delta
        }
    }
})

export const { actions: postActions, reducer: postReducer } = postSlice
