'use client'

import { forwardRef, HTMLAttributes } from 'react'
import { TPreviewProps } from '@/shared/ui/MediaPreview/types'
import { useMediaPreview } from '../model/hooks/useMediaPreview'
import './_.css'
import 'photoswipe/style.css'

export const PreviewContainer = forwardRef<
    HTMLDivElement,
    TPreviewProps & HTMLAttributes<HTMLDivElement>
>(({ onCaptionChange, children, ...attrs }, ref) => {
    const { containerId } = useMediaPreview({ onCaptionChange })

    return (
        <div
            {...attrs}
            ref={ref}
            id={containerId}>
            {children}
        </div>
    )
})

PreviewContainer.displayName = 'PreviewContainer'
