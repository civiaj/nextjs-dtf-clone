'use client'

import { useRef } from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { createStore } from './index'

export function StoreProvider({ children }: { children: React.ReactNode }) {
    const storeRef = useRef<ReturnType<typeof createStore>>(undefined)

    if (!storeRef.current) {
        storeRef.current = createStore()
    }

    return (
        <Provider store={storeRef.current.store}>
            <PersistGate
                loading={null}
                persistor={storeRef.current.persistor}>
                {children}
            </PersistGate>
        </Provider>
    )
}
