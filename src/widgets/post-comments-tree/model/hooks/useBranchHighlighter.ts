import { useCallback, useEffect, useRef } from 'react'
import { TComment } from '@/shared/types/comment.types'

export const useBranchHighlighter = () => {
    const styleRef = useRef<HTMLStyleElement | null>(null)

    const removeHighlight = useCallback(() => {
        if (styleRef.current) {
            styleRef.current.innerHTML = ''
        }
    }, [])

    const highlightBranch = useCallback((id: TComment['id']) => {
        if (!styleRef.current) {
            const el = document.createElement('style')
            el.id = 'branch-hover-style'
            document.head.appendChild(el)
            styleRef.current = el
        }

        styleRef.current.innerHTML = `
                [data-branch-id="${id}"] {
                    --color-branch: var(--active);
                }
                `
    }, [])

    useEffect(() => {
        return () => removeHighlight()
    }, [removeHighlight])

    return { highlightBranch, removeHighlight }
}
