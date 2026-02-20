import createWebStorage from 'redux-persist/lib/storage/createWebStorage'

const createNoopStorage = () => {
    return {
        getItem(_key: unknown) {
            return Promise.resolve(null)
        },
        setItem(_key: unknown, value: unknown) {
            return Promise.resolve(value)
        },
        removeItem(_key: unknown) {
            return Promise.resolve()
        }
    }
}

const storage = typeof window !== 'undefined' ? createWebStorage('local') : createNoopStorage()

const persistAuthConfig = {
    storage,
    key: 'staleUser',
    whitelist: ['staleUser']
}

const persistRootConfig = {
    storage,
    key: 'root',
    whitelist: ['ui']
}

export { persistAuthConfig, persistRootConfig }
