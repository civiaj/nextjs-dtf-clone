'use client'

import { cn } from '@/shared/utils/common.utils'

export const Separator = ({ className }: { className?: string }) => {
    return (
        <div
            className={cn(
                'text-foreground before:flex before:items-center before:justify-center before:pt-3 before:text-4xl before:content-["***"] md:before:text-5xl',
                className
            )}
        />
    )
}
