import * as React from 'react'
import { cn } from '@/shared/utils/common.utils'

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
    ({ className, ...props }, ref) => {
        return (
            <input
                className={cn(
                    'active-glow h-8 w-full rounded-xl !bg-card px-3 text-sm outline-none sm:h-9 sm:text-base',
                    className
                )}
                ref={ref}
                {...props}
            />
        )
    }
)
Input.displayName = 'Input'

const TextArea = React.forwardRef<
    HTMLTextAreaElement,
    React.TextareaHTMLAttributes<HTMLTextAreaElement> & { minHeight?: number }
>(({ className, minHeight = 96, onChange, value, defaultValue, ...props }, ref) => {
    const textareaRef = React.useRef<HTMLTextAreaElement | null>(null)

    const setRefs = React.useCallback(
        (node: HTMLTextAreaElement | null) => {
            textareaRef.current = node

            if (typeof ref === 'function') {
                ref(node)
                return
            }

            if (ref) {
                ref.current = node
            }
        },
        [ref]
    )

    React.useLayoutEffect(() => {
        if (!textareaRef.current) return
        updateTextareaHeight(textareaRef.current, minHeight)
    }, [value, defaultValue, minHeight])

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange?.(e)
        updateTextareaHeight(e.currentTarget, minHeight)
    }

    return (
        <textarea
            className={cn(
                'active-glow flex w-full resize-none rounded-xl !bg-card px-3 py-2 text-sm outline-none sm:h-9 sm:text-base',
                className
            )}
            style={{ minHeight }}
            ref={setRefs}
            {...props}
            value={value}
            defaultValue={defaultValue}
            onChange={handleChange}
        />
    )
})
TextArea.displayName = 'TextArea'

export function updateTextareaHeight(textarea: HTMLTextAreaElement, minHeight: number) {
    textarea.style.setProperty('--textarea-height', `${minHeight}px`)
    textarea.style.height = 'auto'

    const nextHeight = Math.max(textarea.scrollHeight, minHeight)

    textarea.style.setProperty(
        '--textarea-height',
        `${nextHeight}px`
    )
    textarea.style.height = `${nextHeight}px`
}

export { Input, TextArea }
