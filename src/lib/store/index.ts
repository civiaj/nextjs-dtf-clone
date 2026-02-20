'use client'

import { combineReducers, configureStore, UnknownAction } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { useDispatch, useSelector, useStore } from 'react-redux'
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER
} from 'redux-persist'
import { assetsReducer } from '@/entities/assets'
import { authReducer } from '@/entities/auth'
import { commentReducer } from '@/entities/comment'
import { postReducer } from '@/entities/post'
import { uiReducer } from '@/entities/ui'
import { userReducer } from '@/entities/user'
import { api } from '@/shared/api'
import { commentsTreeReducer } from '@/widgets/post-comments-tree'
import { errorMiddleware } from './error.middleware'
import listenerMiddleware from './listenerMiddleware'
import { persistRootConfig, persistAuthConfig } from './persist'

const appReducer = combineReducers({
    ui: uiReducer,
    user: userReducer,
    auth: persistReducer(persistAuthConfig, authReducer),
    post: postReducer,
    comment: commentReducer,
    commentsTree: commentsTreeReducer,
    assets: assetsReducer,
    [api.reducerPath]: api.reducer
})

const rootReducer = (state: Partial<RootState> | undefined, action: UnknownAction) => {
    if (action.type === 'user/logout') {
        if (state?.[api.reducerPath]) {
            state = { [api.reducerPath]: state[api.reducerPath] }
        }
    }
    return appReducer(state, action)
}

let _persistor: ReturnType<typeof persistStore>
const persistedReducer = persistReducer(persistRootConfig, rootReducer)
export let _store: ReturnType<typeof createStore>['store'] | null = null

export const createStore = () => {
    const store = configureStore({
        reducer: persistedReducer,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({
                serializableCheck: {
                    ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
                }
            })
                .prepend(listenerMiddleware.middleware)
                .concat(api.middleware, errorMiddleware)
    })
    _persistor = persistStore(store)
    _store = store
    setupListeners(store.dispatch)

    return { store, persistor: _persistor }
}

export const getStore = () => {
    if (!_store) throw new Error('Store not initialized')
    return _store
}

export type AppStore = ReturnType<typeof createStore>['store']
export type RootState = ReturnType<typeof appReducer>
export type AppDispatch = AppStore['dispatch']
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
export const useAppStore = useStore.withTypes<AppStore>()

export * from './StoreProvider'
