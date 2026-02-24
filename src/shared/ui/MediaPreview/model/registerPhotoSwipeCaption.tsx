import PhotoSwipe from 'photoswipe'
import { createRoot } from 'react-dom/client'
import { TPreviewProps } from '../types'
import { PreviewCaption } from '../ui/PreviewCaption'

export function registerPhotoSwipeCaption(
    pswp: PhotoSwipe,
    getOnCaptionChange: () => TPreviewProps['onCaptionChange']
) {
    pswp.ui?.registerElement({
        name: 'caption',
        order: 9,
        isButton: false,
        appendTo: 'root',
        onInit: (el, pswpInstance) => {
            const root = createRoot(el)
            const renderCaption = () => {
                const slide = pswpInstance.currSlide?.data.element
                const caption = slide?.getAttribute('data-pswp-caption') ?? ''
                const id = slide?.getAttribute('data-pswp-id')
                    ? Number(slide.getAttribute('data-pswp-id'))
                    : 0
                const onCaptionChange = getOnCaptionChange()
                const isEditable = typeof onCaptionChange === 'function'

                root.render(
                    <PreviewCaption
                        key={id}
                        editable={isEditable}
                        caption={caption}
                        onChange={(text) => onCaptionChange?.(id, text)}
                    />
                )
            }

            pswpInstance.on('change', renderCaption)
            pswpInstance.on('destroy', () => root.unmount())
            renderCaption()
        }
    })
}
