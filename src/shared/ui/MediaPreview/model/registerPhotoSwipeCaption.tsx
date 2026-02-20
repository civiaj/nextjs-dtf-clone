import PhotoSwipe from 'photoswipe'
import { createRoot } from 'react-dom/client'
import { TPreviewProps } from '../types'
import { PreviewCaption } from '../ui/PreviewCaption'

export function registerPhotoSwipeCaption(
    pswp: PhotoSwipe,
    onCaptionChange?: TPreviewProps['onCaptionChange']
) {
    const isEditable = typeof onCaptionChange === 'function'

    pswp.ui?.registerElement({
        name: 'caption',
        order: 9,
        isButton: false,
        appendTo: 'root',
        onInit: (el, pswpInstance) => {
            const root = createRoot(el)

            pswpInstance.on('change', () => {
                const slide = pswpInstance.currSlide?.data.element
                const caption = slide?.getAttribute('data-pswp-caption') ?? ''
                const id = slide?.getAttribute('data-pswp-id')
                    ? Number(slide.getAttribute('data-pswp-id'))
                    : 0

                root.render(
                    <PreviewCaption
                        key={id}
                        editable={isEditable}
                        caption={caption}
                        onChange={(text) => onCaptionChange?.(id, text)}
                    />
                )
            })
        }
    })
}
