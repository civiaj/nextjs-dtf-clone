import { createSelector } from '@reduxjs/toolkit'
import { RootState } from '@/lib/store'
import { TComment } from '@/shared/types/comment.types'

export const makeSelectComment = () =>
    createSelector(
        [
            (state: RootState) => state.comment.data.entities,
            (_: RootState, id?: TComment['id']) => id
        ],
        (entities, id) => (id ? entities[id] : null)
    )
