import * as React from 'react'
import { cn } from '@/shared/utils/common.utils'

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
    ({ className, ...props }, ref) => {
        return (
            <input
                className={cn(
                    'active-glow flex h-8 w-full rounded-xl !bg-card px-3 text-sm outline-none sm:h-9 sm:text-base',
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
>(({ className, minHeight = 96, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        props.onChange?.(e)
        if (e.target instanceof HTMLTextAreaElement) {
            updateTextareaHeight(e.target, minHeight)
        }
    }

    return (
        <textarea
            className={cn(
                'active-glow flex w-full resize-none rounded-xl !bg-card px-3 py-2 text-sm outline-none sm:h-9 sm:text-base',
                className
            )}
            style={{ minHeight }}
            ref={ref}
            {...props}
            onChange={handleChange}
        />
    )
})
TextArea.displayName = 'TextArea'

function updateTextareaHeight(textarea: HTMLTextAreaElement, minHeight: number) {
    textarea.style.height = 'auto'
    textarea.style.setProperty(
        '--textarea-height',
        `${Math.max(textarea.scrollHeight, minHeight)}px`
    )
    textarea.style.height = 'var(--textarea-height)'
}

export { Input, TextArea }
