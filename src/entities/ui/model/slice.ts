import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { TMainPageSection } from '@/shared/types/comment.types'
import { AppTheme } from './types'

type InitialState = {
    sidebarIsOpen: boolean
    defaultFeed: TMainPageSection
    theme: AppTheme
}

export const getResolvedTheme = (theme: AppTheme): Exclude<AppTheme, 'system'> => {
    if (typeof window === 'undefined') return 'light'
    if (theme === 'system') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return theme
}

const initialState: InitialState = {
    sidebarIsOpen: false,
    defaultFeed: 'popular',
    theme: 'system'
}

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        toggleSidebar: (state) => {
            state.sidebarIsOpen = !state.sidebarIsOpen
        },
        setDefaultFeed: (state, action: PayloadAction<TMainPageSection>) => {
            state.defaultFeed = action.payload
        },
        setTheme: (state, action: PayloadAction<AppTheme>) => {
            state.theme = getResolvedTheme(action.payload)
        }
    }
})

export const { actions: uiActions, reducer: uiReducer } = uiSlice
