import { createDraftSafeSelector } from '@reduxjs/toolkit'
import { RootState } from '@/lib/store'
import { TComment } from '@/shared/types/comment.types'
import { TUser } from '@/shared/types/user.types'
import { getRemainingRepliesCount } from './utils'

export const selectLinearTreeIds = (state: RootState) => state.commentsTree.linearTreeIds
export const selectRootRemainingCommentCount = createDraftSafeSelector(
    [
        (state: RootState) => state.comment.data.entities,
        (state: RootState) => state.commentsTree.treeIds,
        (_: RootState, totalCount: number) => totalCount
    ],
    (adapterEntities, treeIds, totalCount) => {
        return getRemainingRepliesCount(adapterEntities, treeIds, { id: null, totalCount })
    }
)
export const makeSelectIsReplyTarget = () =>
    createDraftSafeSelector(
        [
            (state: RootState) => state.commentsTree.replyId,
            (_: RootState, id: TComment['id']) => id
        ],
        (replyId, id) => replyId === id
    )
export const makeSelectAreRepliesExpanded = () =>
    createDraftSafeSelector(
        [
            (state: RootState) => state.commentsTree.expandedIds,
            (_: RootState, id: TComment['id']) => id
        ],
        (expandedIds, id) => !!expandedIds[id]
    )

export const makeSelectLoadMoreReplyButtons = () =>
    createDraftSafeSelector(
        [
            (state: RootState) => state.comment.data.entities,
            (state: RootState) => state.commentsTree.treeIds,
            (state: RootState) => state.commentsTree.expandedIds,
            (state: RootState) => state.commentsTree.paginationCursors,
            (_: RootState, id: TComment['id']) => id
        ],
        (adapterEntities, treeIds, expandedIds, paginationCursors, currentId) => {
            const result = []
            let hasHiddenReplies = false
            let id: TComment['id'] = currentId

            while (id) {
                const parentId = adapterEntities[id]?.parentId
                if (!parentId) break

                const branch = treeIds[String(parentId)] ?? []
                const isLastInBranch = branch[branch.length - 1] === id

                if (!isLastInBranch) break

                const isExpanded = !!expandedIds[id]
                hasHiddenReplies = hasHiddenReplies || !isExpanded
                const count = getRemainingRepliesCount(adapterEntities, treeIds, {
                    id: parentId
                })

                if (count > 0 && hasHiddenReplies) {
                    const cursor: number | undefined = paginationCursors[parentId]
                    result.push({ id, parentId, count, cursor })
                }

                id = parentId
            }

            return result
        }
    )

export const makeSelectBranchHistory = () =>
    createDraftSafeSelector(
        [
            (state: RootState) => state.comment.data.entities,
            (state: RootState) => state.commentsTree.treeIds,
            (state: RootState) => state.commentsTree.expandedIds,
            (_: RootState, id: TComment['id']) => id,
            (_: RootState, __: TComment['id'], isEditorHistory?: boolean) => isEditorHistory
        ],
        (entities, treeIds, expandedIds, currentId, isEditorHistory) => {
            if (isEditorHistory) {
                return [{ id: currentId, isTerminal: true, isEmpty: !expandedIds[currentId] }]
            }

            const maxDepth = 5
            const segments: {
                id: TComment['id']
                isTerminal: boolean
                isEmpty: boolean
            }[] = []

            let id: TComment['id'] = currentId

            while (id) {
                const parentId = entities[id]?.parentId
                const parent = entities[parentId!]
                if (!parent) break

                const branch = treeIds[String(parentId)] ?? []
                const isLastInBranch = branch.at(-1) === id
                const remaining = getRemainingRepliesCount(entities, treeIds, {
                    id: parent.id
                })

                const isEmpty = remaining === 0 && isLastInBranch
                const isTerminal = id === currentId

                segments.push({
                    id: parent.id,
                    isTerminal,
                    isEmpty
                })

                id = parent.id
            }

            return segments.reverse().slice(0, maxDepth)
        }
    )

export const makeSelectHasReplies = () =>
    createDraftSafeSelector(
        [
            (state: RootState) => state.commentsTree.treeIds,
            (_: RootState, id: TComment['id']) => id
        ],
        (treeIds, id) => (treeIds[String(id)]?.length ?? 0) > 0
    )

export const makeSelectUiUserMuted = () =>
    createDraftSafeSelector(
        [
            (state: RootState) => state.commentsTree.uiMutedUsers,
            (_: RootState, id?: TUser['id']) => id
        ],
        (uiUserMutedIds, id) => (id ? (uiUserMutedIds[id] ?? false) : false)
    )
