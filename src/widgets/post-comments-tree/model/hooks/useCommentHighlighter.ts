import { useCallback, useEffect, useRef } from 'react'
import { TComment } from '@/shared/types/comment.types'

export const useCommentHighlighter = () => {
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const styleRef = useRef<HTMLStyleElement | null>(null)

    const removeHighlight = useCallback(() => {
        if (styleRef.current) {
            styleRef.current.innerHTML = ''
        }
        if (timerRef.current) {
            clearTimeout(timerRef.current)
            timerRef.current = null
        }
    }, [])

    const handleCommentHighlight = useCallback(
        (id: TComment['id']) => {
            if (!styleRef.current) {
                const el = document.createElement('style')
                el.id = 'comment-highlight-style'
                document.head.appendChild(el)
                styleRef.current = el
            }

            styleRef.current.innerHTML = `
                [data-comment-highlight-id="${id}"] {
                    background-color: hsl(var(--active)/10%);
                }
                `

            if (timerRef.current) clearTimeout(timerRef.current)
            timerRef.current = setTimeout(removeHighlight, 1000)
        },
        [removeHighlight]
    )

    useEffect(() => {
        return () => removeHighlight()
    }, [removeHighlight])

    return handleCommentHighlight
}
