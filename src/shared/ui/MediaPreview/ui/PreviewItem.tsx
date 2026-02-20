'use client'

import { forwardRef } from 'react'
import { TMedia } from '@/shared/types/media.types'

export const PreviewItem = forwardRef<
    HTMLAnchorElement,
    {
        media: Pick<TMedia, 'height' | 'width' | 'type' | 'src' | 'id'>
        caption?: string
        children?: React.ReactNode
    } & React.HTMLAttributes<HTMLAnchorElement>
>(({ media, caption, children, ...attrs }, ref) => {
    return (
        <a
            {...attrs}
            ref={ref}
            href={media.src}
            data-cropped={true}
            data-pswp-id={media.id}
            data-pswp-type={media.type}
            data-pswp-width={media.width}
            data-pswp-height={media.height}
            data-pswp-caption={caption}
            target='_blank'
            rel='noreferrer'>
            {children}
        </a>
    )
})
PreviewItem.displayName = 'PreviewItem'
