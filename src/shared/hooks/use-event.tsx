'use client'

import { useCallback, useLayoutEffect, useRef } from 'react'

export default function useEvent<T extends (...args: unknown[]) => unknown>(handler: T) {
    const ref = useRef<T | null>(null)

    useLayoutEffect(() => {
        ref.current = handler
    }, [handler])

    return useCallback((...args: Parameters<T>[]): ReturnType<T> => {
        return ref.current?.(...args) as ReturnType<T>
    }, [])
}
