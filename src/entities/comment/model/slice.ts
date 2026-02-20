import { createEntityAdapter, createSlice, EntityState, PayloadAction } from '@reduxjs/toolkit'
import { TComment } from '@/shared/types/comment.types'
import { TReaction } from '@/shared/types/reaction.types'

const adapter = createEntityAdapter({ selectId: (c: TComment) => c.id })

type CommentSlice = {
    data: EntityState<TComment, number>
}

const initialState: CommentSlice = { data: adapter.getInitialState() }

const commentSlice = createSlice({
    name: 'comments',
    initialState,
    reducers: {
        setMany(state, action: PayloadAction<TComment[]>) {
            adapter.setMany(state.data, action.payload)
        },

        setOne(state, action: PayloadAction<TComment>) {
            let id = action.payload.parentId

            while (id !== null) {
                const parent = state.data.entities[id]

                if (!parent) break

                parent.replyCount += 1
                id = parent.parentId
            }

            adapter.setOne(state.data, action.payload)
        },

        reset: (state) => {
            adapter.removeAll(state.data)
        },

        toggleRemoveOne(state, action: PayloadAction<{ id: TComment['id'] }>) {
            const { id } = action.payload
            const comment = state.data.entities[id]

            if (!comment) return

            comment.isDeleted = !comment.isDeleted
        },

        toggleBookmarked(state, action: PayloadAction<{ id: TComment['id'] }>) {
            const { id } = action.payload
            const comment = state.data.entities[id]

            if (!comment) return

            const isBookmarked = comment.isBookmarked
            const delta = isBookmarked ? -1 : 1

            state.data.entities[id].isBookmarked = !isBookmarked
            state.data.entities[id].bookmarkCount += delta
        },

        toggleReaction(
            state,
            action: PayloadAction<{ id: TComment['id']; reactionValueId: TReaction['id'] }>
        ) {
            const { id, reactionValueId } = action.payload
            const comment = state.data.entities[id]

            if (!comment) return

            const prev = comment.reactions.activeReactionId
            const isSame = prev === reactionValueId
            const delta = isSame ? -1 : 1

            comment.reactions.activeReactionId = isSame ? null : reactionValueId
            comment.reactions.items = comment.reactions.items.map((r) => {
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
            action: PayloadAction<{ id: TComment['id']; reactions: TComment['reactions'] }>
        ) {
            const { id, reactions } = action.payload
            const comment = state.data.entities[id]

            if (!comment) return

            comment.reactions = reactions
        }
    }
})

export const { actions: commentActions, reducer: commentReducer } = commentSlice
