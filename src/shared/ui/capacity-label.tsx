import { cn } from '@/shared/utils/common.utils'

export const CapacityLabel = ({
    max,
    size,
    className,
    dangerSize = 20,
    showOverlay = true
}: {
    max: number
    size: number
    className?: string
    dangerSize?: number
    showOverlay?: boolean
}) => {
    const showCount = max <= size + dangerSize
    const showDangerOverlay = size > max

    if (!showCount) return null

    return (
        <div
            className={cn('pointer-events-none absolute inset-0 rounded-xl', {
                ['bg-red-500/10 text-destructive']: showDangerOverlay && showOverlay
            })}>
            <div
                className={cn(
                    'absolute bottom-0 right-0 hidden translate-y-full text-xs',
                    {
                        ['block text-destructive']: showCount
                    },
                    className
                )}>
                {max - size}
            </div>
        </div>
    )
}
