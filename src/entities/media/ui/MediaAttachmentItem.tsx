import { memo } from 'react'
import { CloseAppIcon } from '@/shared/icons'
import { TMedia } from '@/shared/types/media.types'
import { AppImage, AppMediaContainer } from '@/shared/ui/media'
import { PreviewItem } from '@/shared/ui/MediaPreview'
import { formatMediaDuration } from '@/shared/utils/common.utils'
import { updateSrcIfVideo } from '../model/utils'

export const MediaAttachmentItem = memo((props: TProps) => {
    const { id, children } = props

    return (
        <div className='relative h-20 w-20 shrink-0 rounded-xl sm:h-28 sm:w-28'>
            <AttachmentItem {...props} />
            <button
                className='absolute right-1 top-1 z-[1] flex h-5 w-5 items-center justify-center rounded-full bg-black/60'
                data-remove-id={id}
                type='button'>
                <CloseAppIcon
                    className='h-4 w-4 text-primary-foreground'
                    strokeWidth={3}
                />
            </button>
            {children}
        </div>
    )
})

const AttachmentItem = (props: TProps) => {
    const { previewAvailable, src, type } = props

    if (previewAvailable) {
        const { src, type, width, height, blurDataURL, id, caption, thumbnail, duration } = props

        return (
            <PreviewItem
                media={{ src, id, type, height, width }}
                caption={caption}>
                <AppMediaContainer
                    height={height}
                    width={width}
                    blurDataURL={blurDataURL}
                    className='relative overflow-hidden rounded-xl object-cover'>
                    <AppImage
                        className='cursor-zoom-in object-cover'
                        media={updateSrcIfVideo({ src, type, thumbnail })}
                    />
                    {type === 'video' && duration && (
                        <div className='pointer-events-none absolute bottom-1 right-1 rounded-md bg-black/60 px-2 py-1 text-sm font-medium text-white'>
                            {formatMediaDuration(duration)}
                        </div>
                    )}
                </AppMediaContainer>
            </PreviewItem>
        )
    }

    return (
        <AppImage
            media={updateSrcIfVideo({ src, type })}
            className='rounded-xl object-cover'
        />
    )
}

type TBaseProps = {
    children?: React.ReactNode
} & Pick<TMedia, 'id' | 'src' | 'type'>

type TProps =
    | ({
          previewAvailable: false | undefined
      } & TBaseProps)
    | ({
          previewAvailable: true
      } & TBaseProps &
          Pick<TMedia, 'height' | 'width' | 'blurDataURL' | 'thumbnail' | 'duration'> & {
              caption?: string
          })
MediaAttachmentItem.displayName = 'MediaAttachmentItem'
