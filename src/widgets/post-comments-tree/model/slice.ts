import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { TComment } from '@/shared/types/comment.types'
import { TPost } from '@/shared/types/post.types'
import { TUser } from '@/shared/types/user.types'
import { PostCommentsSort } from '@/shared/validation/comment.schema'
import { commentsTreeService } from './service'
import { buildLinearOrderFromTree } from './utils'

const initialState: CommentsTreeSlice = {
    postId: null,
    uiThreadId: null,
    sortBy: 'hotness',
    replyId: null,
    treeIds: {},
    uiMutedUsers: {},
    linearTreeIds: [],
    expandedIds: {},
    paginationCursors: {},
    requestedScrollToNode: null
}

const commentsTreeSlice = createSlice({
    name: 'commentsTree',
    initialState,
    reducers: {
        applyCommentsBatch(state, action: PayloadAction<TComment[]>) {
            const map = new Map<string, Set<number>>()

            for (const { parentId, id } of action.payload) {
                const key = String(parentId)
                if (!map.has(key)) map.set(key, new Set())
                map.get(key)!.add(id)
            }

            for (const [key, set] of map) {
                const branch = state.treeIds[key] ?? []
                const merged = Array.from(new Set([...branch, ...set]))
                state.treeIds[key] = merged
            }

            Object.keys(state.treeIds).forEach((key) => {
                if (typeof state.expandedIds[key] === 'undefined') state.expandedIds[key] = true
            })

            state.linearTreeIds = buildLinearOrderFromTree(state.treeIds, state.expandedIds)
        },
        addLocalComment(state, action: PayloadAction<TComment>) {
            const comment = action.payload
            const key = String(comment.parentId)
            const branch = state.treeIds[key] ?? []
            state.treeIds[key] = [comment.id, ...branch]

            if (comment.parentId) {
                state.expandedIds[comment.parentId] = true
            }

            state.linearTreeIds = buildLinearOrderFromTree(state.treeIds, state.expandedIds)
        },
        toggleReplyTarget(state, action: PayloadAction<{ id: TComment['id'] }>) {
            const { id } = action.payload
            state.replyId = state.replyId === id ? null : id
        },
        toggleRepliesExpansion(state, action: PayloadAction<{ id: TComment['id'] }>) {
            const { id } = action.payload
            state.expandedIds[id] = !state.expandedIds[id]
            state.linearTreeIds = buildLinearOrderFromTree(state.treeIds, state.expandedIds)
        },
        requestScrollToNode(state, action: PayloadAction<{ id: number }>) {
            state.requestedScrollToNode = action.payload.id
        },
        clearScrollToNode(state) {
            state.requestedScrollToNode = null
        },
        setUserMute(state, action: PayloadAction<{ userId: TUser['id']; value: boolean }>) {
            state.uiMutedUsers[action.payload.userId] = action.payload.value
        },
        setSortBy(state, action: PayloadAction<PostCommentsSort>) {
            state.sortBy = action.payload
        },
        setContext(
            state,
            action: PayloadAction<{
                uiThreadId: number | null
                postId: TPost['id'] | null
            }>
        ) {
            const { postId, uiThreadId } = action.payload
            state.postId = postId
            state.uiThreadId = uiThreadId
        },
        resetTree(state) {
            state.replyId = null
            state.treeIds = {}
            state.linearTreeIds = []
            state.expandedIds = {}
            state.uiMutedUsers = {}
            state.paginationCursors = {}
            state.requestedScrollToNode = null
        }
    },
    extraReducers: (builder) => {
        builder.addMatcher(
            commentsTreeService.endpoints.getPostComments.matchFulfilled,
            (state, { payload, meta }) => {
                const args = meta.arg.originalArgs
                if (args.type !== 'post') return

                const cursor = payload.pages[0].result.cursor
                const repliesCursorByParent = payload.pages[0].result.repliesCursorByParent

                const key = String(args.parentId ?? null)

                if (cursor) {
                    state.paginationCursors[key] = cursor
                }

                if (!repliesCursorByParent) return

                Object.entries(repliesCursorByParent).forEach(([parentId, parentCursor]) => {
                    state.paginationCursors[parentId] = parentCursor
                })
            }
        )
    }
})

const { actions, reducer } = commentsTreeSlice
export { actions as commentsTreeActions, reducer as commentsTreeReducer }
export type CommentsTreeSlice = {
    postId: TPost['id'] | null
    sortBy: PostCommentsSort
    uiThreadId: TComment['id'] | null
    replyId: TComment['id'] | null
    treeIds: Record<string, TComment['id'][]>
    uiMutedUsers: Record<string, boolean>
    linearTreeIds: TComment['id'][]
    expandedIds: Record<string, boolean>
    paginationCursors: Record<string, number>
    requestedScrollToNode: number | null
}
