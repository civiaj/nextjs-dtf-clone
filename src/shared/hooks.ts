'use client'

import { RefObject, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { TypedUseQuery } from '@reduxjs/toolkit/query/react'
import { TResponseBase } from '@/shared/types'
import { TPost } from '@/shared/types/post.types'
import { copyTextToClipboard } from '@/shared/utils/copyTextToClipboard'

export const useIntersectionObserver = (props: TUseIntersectionObserver) => {
    const inner = useRef<HTMLDivElement | null>(null)
    const { onScrollEnd, observerTarget, observerRoot, stopObserver } = props

    useEffect(() => {
        const target = observerTarget ?? inner.current

        if (!target || stopObserver) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    onScrollEnd()
                }
            },
            { rootMargin: '10px', threshold: 0.5, root: observerRoot ?? null }
        )

        observer.observe(target)
        return () => {
            observer.disconnect()
        }
    }, [onScrollEnd, observerRoot, observerTarget, stopObserver])

    return inner
}

export const useDebounce = <T>(callback: (...args: T[]) => void, delay: number) => {
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
    const fn = useCallback(
        (...args: T[]) => {
            if (timer.current) clearTimeout(timer.current)
            timer.current = setTimeout(() => {
                callback(...args)
            }, delay)
        },
        [callback, delay]
    ) as typeof callback

    const abort = useCallback(() => {
        if (timer.current) clearTimeout(timer.current)
    }, [])

    return [fn, abort]
}

export const useOutsideClick = (
    handleClose: (event: MouseEvent) => void,
    preventClose: boolean = false,
    capture: boolean = true
) => {
    //eslint-disable-next-line
    const ref = useRef<any>(null)

    useEffect(() => {
        const handleClick = (event: MouseEvent) => {
            if (preventClose) return
            if (ref.current && !ref.current.contains(event.target)) {
                handleClose(event)
            }
        }

        document.addEventListener('mousedown', handleClick, { capture })

        return () => {
            document.removeEventListener('mousedown', handleClick, { capture })
        }
    }, [ref, handleClose, capture, preventClose])

    return ref
}
export const useInert = ({ enableInert }: { enableInert: boolean } = { enableInert: true }) => {
    useEffect(() => {
        if (!enableInert) return

        const root = document.getElementById('root')
        if (root) {
            root.inert = true
            document.body.style.overflow = 'hidden'
            root.style.touchAction = 'none'
            root.style.pointerEvents = 'none'
        }

        return () => {
            if (root) {
                root.inert = false
                document.body.style.overflow = 'unset'
                root.style.touchAction = 'auto'
                root.style.pointerEvents = 'auto'
            }
        }
    }, [enableInert])
    return null
}

export const useResizeObserver = <T extends HTMLElement>(
    onResizeCallback?: (value: { width: number; height: number }) => void,
    observeRef?: RefObject<T | null>
) => {
    const internalRef = useRef(null)
    const elementRef = observeRef ?? internalRef
    const [value, setValue] = useState<{ width: number; height: number } | null>(null)

    useLayoutEffect(() => {
        const element = elementRef.current

        if (!element) return

        const observer = new ResizeObserver((entries) => {
            if (entries[0]) {
                const { width, height } = entries[0].contentRect
                setValue({ width, height })
                onResizeCallback?.({ width, height })
            }
        })

        observer.observe(element)

        return () => {
            observer.disconnect()
        }
    }, [elementRef, onResizeCallback])

    return { elementRef, value }
}

/* eslint-disable @typescript-eslint/no-explicit-any*/
interface useInfiniteScrollProps {
    queryHook: TypedUseQuery<any, any, any>
    queryParams?: { [x: string]: any }
    onScrollEndCallback?: (cursor: number) => void
    setPosts: (posts: TPost[]) => void
    queryHookSettings?: {
        skip?: boolean
        refetchOnMountOrArgChange?: boolean | number
        pollingInterval?: number
        refetchOnReconnect?: boolean
        refetchOnFocus?: boolean
    }
}

export const useInfiniteScroll = <T extends TPost>({
    setPosts,
    queryHook,
    queryParams,
    onScrollEndCallback,
    queryHookSettings = {}
}: useInfiniteScrollProps) => {
    const [stateCursor, setStateCursor] = useState<number | void>()
    const queryResult = queryHook({ ...queryParams, cursor: stateCursor }, queryHookSettings)
    const { data, isLoading, isFetching } = queryResult
    const { result } =
        (data as TResponseBase<{ items: T[]; message: string; cursor?: number }>) ?? {}
    const { items = [], cursor = 0 } = result ?? {}

    const waitLoading = isLoading || isFetching
    const isEnd = cursor === null

    const onScrollEnd = useCallback(() => {
        const areMorePages = cursor !== null

        if (areMorePages && !waitLoading) {
            setStateCursor(() => cursor)
            onScrollEndCallback?.(cursor)
        }
    }, [waitLoading, onScrollEndCallback, cursor])

    useEffect(() => {
        if (!waitLoading && items) {
            setPosts(items)
        }
    }, [waitLoading, items, setPosts])

    return { ...queryResult, isEnd, onScrollEnd }
}

type TUseIntersectionObserver = {
    onScrollEnd: () => void | Promise<void>
    stopObserver?: boolean
    observerTarget?: HTMLDivElement | null
    observerRoot?: Element | null
}

export const useMediaQuery = (query: string): boolean => {
    const [matches, setMatches] = useState(false)

    useEffect(() => {
        const media = window.matchMedia(query)
        if (media.matches !== matches) {
            setMatches(media.matches)
        }

        const listener = () => setMatches(media.matches)
        media.addEventListener('change', listener)
        return () => media.removeEventListener('change', listener)
    }, [query, matches])

    return matches
}

export const usePrevious = <T>(value: T) => {
    const ref = useRef<T | null>(null)

    useEffect(() => {
        ref.current = value
    })

    return ref.current
}

export const useCopyToClipboard = () => {
    const [isCopied, setIsCopied] = useState(false)
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    const copy = useCallback(async (text: string, timeout = 2000) => {
        await copyTextToClipboard(text)
        setIsCopied(true)

        if (timerRef.current) clearTimeout(timerRef.current)

        timerRef.current = setTimeout(() => setIsCopied(false), timeout)
    }, [])

    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current)
            }
        }
    }, [])

    return { copy, isCopied }
}
