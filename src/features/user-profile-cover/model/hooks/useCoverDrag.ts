import { useEffect, useRef, useState } from 'react'

export const useCoverDrag = (
    el: HTMLDivElement | null,
    {
        onDragEnd,
        onDragUpdate
    }: {
        onDragUpdate: (deltaY: number, el: HTMLDivElement) => void
        onDragEnd: (el: HTMLDivElement) => void
    }
) => {
    const startY = useRef(0)
    const [isDragging, setIsDragging] = useState(false)

    useEffect(() => {
        if (!el) return

        const startDrag = (clientY: number) => {
            setIsDragging(true)
            startY.current = clientY
        }

        const moveDrag = (clientY: number) => {
            if (!isDragging) return
            const deltaY = clientY - startY.current
            onDragUpdate(deltaY, el)
        }

        const endDrag = () => {
            onDragEnd(el)
            setIsDragging(false)
        }

        const onPointerDown = (e: PointerEvent) => startDrag(e.clientY)
        const onPointerMove = (e: PointerEvent) => moveDrag(e.clientY)

        const onTouchStart = (e: TouchEvent) => e.touches[0] && startDrag(e.touches[0].clientY)
        const onTouchMove = (e: TouchEvent) => e.touches[0] && moveDrag(e.touches[0].clientY)

        const ao = new AbortController()
        const signal = ao.signal

        el.addEventListener('pointerdown', onPointerDown, { signal })
        document.addEventListener('pointermove', onPointerMove, { signal })
        document.addEventListener('pointerup', endDrag, { signal })

        el.addEventListener('touchstart', onTouchStart, { signal, passive: false })
        document.addEventListener('touchmove', onTouchMove, { signal, passive: false })
        document.addEventListener('touchend', endDrag, { signal })

        return () => ao.abort()
    }, [isDragging, el, onDragUpdate, onDragEnd])

    return { isDragging }
}
