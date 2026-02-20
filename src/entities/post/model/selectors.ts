import { createSelector } from '@reduxjs/toolkit'
import { RootState } from '@/lib/store'
import { TPost } from '@/shared/types/post.types'

export const makeSelectPost = () =>
    createSelector(
        [
            (state: RootState) => state.post.data.entities,
            (_: RootState, id?: TPost['id'] | null) => id
        ],
        (entities, id) => (id ? entities[id] : null)
    )

export const makeSelectPostIsDeleted = () =>
    createSelector(
        [(state: RootState) => state.post.clientDeletedIds, (_: RootState, id?: TPost['id']) => id],
        (entities, id) => (id ? (entities[id] ?? false) : false)
    )
