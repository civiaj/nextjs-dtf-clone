import { useEffect } from 'react'

export const useScrollToCommentsOnHash = () => {
    useEffect(() => {
        if (typeof window === 'undefined' || window.location.hash !== '#comments') return

        const el = document.getElementById('comments')
        el?.scrollIntoView({ behavior: 'instant' })
    }, [])
}
