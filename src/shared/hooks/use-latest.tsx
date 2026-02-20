'use client'

import { useLayoutEffect, useRef } from 'react'

export default function useLatest<T>(value: T) {
    const ref = useRef(value)

    useLayoutEffect(() => {
        ref.current = value
    })
    return ref
}
