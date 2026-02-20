import { createSelector } from '@reduxjs/toolkit'
import { RootState } from '@/lib/store'
import { TUser } from '@/shared/types/user.types'

export const makeSelectUser = () =>
    createSelector(
        [(state: RootState) => state.user.data.entities, (_: RootState, id?: TUser['id']) => id],
        (entities, id) => (id ? entities[id] : null)
    )
