'use client'

import { useEffect, useRef } from 'react'
import { VListWindowRef } from '@/components/VList'
import { useAppDispatch, useAppSelector } from '@/lib/store'
import { TComment } from '@/shared/types/comment.types'
import { useCommentHighlighter } from './useCommentHighlighter'
import { selectLinearTreeIds } from '../selectors'
import { commentsTreeActions } from '../slice'

export const useScrollToParentComment = (initialId?: TComment['id']) => {
    const dispatch = useAppDispatch()
    const ids = useAppSelector((state) => selectLinearTreeIds(state))
    const scrollId = useAppSelector((state) => state.commentsTree.requestedScrollToNode)
    const scrollIndex = scrollId ? ids.indexOf(scrollId) : -1
    const ref = useRef<VListWindowRef | null>(null)

    const highlight = useCommentHighlighter()

    useEffect(() => {
        if (!ref.current || scrollIndex === -1 || !scrollId) return

        let io: IntersectionObserver | null = null
        let raf: number | null = null
        let timeout: ReturnType<typeof setTimeout> | null = null
        let cancel: boolean = false

        ref.current?.scrollToIndex(scrollIndex, { behavior: 'smooth', align: 'auto' })

        const tryObserve = () => {
            if (cancel) {
                return
            }

            const node = document.querySelector(`[data-comment-highlight-id="${scrollId}"]`)

            if (!node) {
                raf = requestAnimationFrame(tryObserve)
                return
            }

            io = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        highlight(scrollId)
                        dispatch(commentsTreeActions.clearScrollToNode())
                        io?.disconnect()
                    }
                },
                { threshold: 0.5 }
            )

            io.observe(node)
        }

        tryObserve()
        timeout = setTimeout(() => {
            cancel = true
            dispatch(commentsTreeActions.clearScrollToNode())
        }, 1000)

        return () => {
            io?.disconnect()
            if (timeout) clearTimeout(timeout)
            if (raf) cancelAnimationFrame(raf)
        }
    }, [scrollIndex, dispatch, scrollId, highlight])

    useEffect(() => {
        if (typeof initialId === 'undefined') return
        dispatch(commentsTreeActions.requestScrollToNode({ id: initialId }))
    }, [dispatch, initialId])

    return ref
}
