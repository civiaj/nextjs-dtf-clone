import { MutableRefObject, ReactNode, useEffect, useRef } from 'react'
import { useOutsideClick } from '@/shared/hooks'
import { cn } from '@/shared/utils/common.utils'

const focusable = 'a, button, input, textarea, select, details'

interface OutsideClickWrapperProps {
    onClose: () => void
    children: ReactNode
    capture?: boolean
    className?: string
    preventClose?: boolean
}

export const OutsideClickWrapper = ({
    onClose,
    children,
    capture,
    className,
    preventClose
}: OutsideClickWrapperProps) => {
    const ref = useOutsideClick(onClose, preventClose, capture)
    const firstNode: MutableRefObject<HTMLElement | null> = useRef(null)
    const lastNode: MutableRefObject<HTMLElement | null> = useRef(null)

    useEffect(() => {
        const element = ref.current
        const focusables = Array.from(element?.querySelectorAll(focusable) ?? []).filter(
            (node) => (node as HTMLElement).getAttribute('tabindex') !== '-1'
        )
        if (focusables && focusables.length > 0) {
            firstNode.current = focusables[0] as HTMLElement
            lastNode.current = focusables[focusables.length - 1] as HTMLElement
            firstNode.current.focus()
        }

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstNode.current) {
                        e.preventDefault()
                        lastNode.current?.focus()
                    }
                } else {
                    if (document.activeElement === lastNode.current) {
                        e.preventDefault()
                        firstNode.current?.focus()
                    }
                }
            } else if (e.key === 'Escape') {
                onClose()
            }
        }

        document.addEventListener('keydown', handleKeyDown)

        return () => {
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [ref, onClose])

    return (
        <div
            className={cn('border-2 border-red-500 bg-white', className)}
            ref={ref}>
            {children}
        </div>
    )
}
