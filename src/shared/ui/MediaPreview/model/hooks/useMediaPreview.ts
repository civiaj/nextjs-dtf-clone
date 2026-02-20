import { useEffect, useId } from 'react'
import PhotoSwipeLightbox from 'photoswipe/lightbox'
import { TPreviewProps } from '../../types'
import ObjectPosition from '../photoswipe-object-position'
import { registerPhotoSwipeCaption } from '../registerPhotoSwipeCaption'
import PhotoSwipeVideoPlugin from '../video-plugin'

export const useMediaPreview = ({
    onCaptionChange
}: {
    onCaptionChange?: TPreviewProps['onCaptionChange']
}) => {
    const containerId = useId()

    useEffect(() => {
        const lightbox = new PhotoSwipeLightbox({
            gallery: `#${containerId}`,
            children: 'a[data-pswp-type]',
            thumbSelector: 'a[data-pswp-type]',
            pswpModule: () => import('photoswipe'),
            arrowPrev: true,
            arrowNext: true,
            zoom: true,
            close: true,
            counter: true,
            trapFocus: true
        })

        new PhotoSwipeVideoPlugin(lightbox, {
            videoAttributes: {
                playsinline: '',
                preload: 'auto',
                muted: '',
                oncanplay: 'this.muted=true',
                controls: 'true'
            }
        })

        new ObjectPosition(lightbox)

        lightbox.addFilter('domItemData', (itemData, _element, linkEl) => {
            if (itemData.type === 'image' && linkEl) {
                itemData.src = linkEl.href
                itemData.w = linkEl.dataset.pswpWidth ? parseInt(linkEl.dataset.pswpWidth) : 0
                itemData.h = linkEl.dataset.pswpHeight ? parseInt(linkEl.dataset.pswpHeight) : 0
                itemData.msrc = linkEl.href
                itemData.thumbCropped = true
            }

            return itemData
        })

        lightbox.on('uiRegister', () => {
            if (lightbox.pswp) {
                registerPhotoSwipeCaption(lightbox.pswp, onCaptionChange)
            }
        })

        lightbox.init()

        return () => {
            lightbox.destroy()
        }
    }, [containerId, onCaptionChange])

    return { containerId }
}
