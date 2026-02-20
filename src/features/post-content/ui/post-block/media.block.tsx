import React from 'react'
import { MediaData } from '@/entities/editor'
import { updateSrcIfVideo } from '@/entities/media'
import { AppImage, AppMediaContainer, AppVideo } from '@/shared/ui/media'
import { PreviewItem } from '@/shared/ui/MediaPreview'
import { Text } from '@/shared/ui/text'
import { cn } from '@/shared/utils/common.utils'
import { TBlockDataMap } from '../../types'

const MAX_GRID_MEDIA = 5

export const MediaBlock = ({ data }: TBlockDataMap['media']) => {
    const { items } = data

    if (items.length === 1) return <SingleMedia item={items[0]} />

    const visibleItems = items.slice(0, MAX_GRID_MEDIA)
    const hiddenItems = items.slice(MAX_GRID_MEDIA)
    const hiddenCount = hiddenItems.length

    return (
        <>
            <MediaGrid>
                {visibleItems.map((item, index) => (
                    <MediaGridItem
                        item={item}
                        key={index}
                        extraCount={
                            index === visibleItems.length - 1 && hiddenCount > 0
                                ? hiddenCount
                                : null
                        }
                    />
                ))}
            </MediaGrid>
            {hiddenItems.map((item, index) => (
                <PreviewItem
                    className='hidden'
                    key={index}
                    media={item.media}
                    caption={item.text}
                />
            ))}
        </>
    )
}

const SingleMedia = ({ item }: { item: MediaData['items'][number] }) => {
    const { media, text } = item

    return (
        <>
            <AppMediaContainer
                underlayClassName='rounded-[11px]'
                className='min-h-[100px] overflow-hidden rounded-[9px] border border-border sm:min-h-[200px]'
                maxHeight={500}
                width={media.width}
                height={media.height}
                blurDataURL={media.blurDataURL}>
                {media.type === 'video' && (
                    <>
                        <AppVideo media={media} />
                        <PreviewItem
                            className='hidden'
                            media={media}
                            caption={text}
                        />
                    </>
                )}
                {media.type === 'image' && (
                    <PreviewItem
                        media={media}
                        caption={text}>
                        <AppImage
                            media={media}
                            className='cursor-zoom-in'
                        />
                    </PreviewItem>
                )}
            </AppMediaContainer>

            {text && (
                <Text
                    className='mt-1 text-xs sm:text-sm'
                    as='p'>
                    {text}
                </Text>
            )}
        </>
    )
}

const MediaGrid = ({ children }: { children: React.ReactNode }) => {
    const count = React.Children.count(children)
    return (
        <div
            className={cn(
                'grid h-[300px] gap-1 overflow-hidden rounded-xl sm:h-[400px] md:h-[500px]',
                {
                    ['media-grid-5']: count === 5,
                    ['media-grid-4']: count === 4,
                    ['media-grid-3']: count === 3,
                    ['media-grid-2']: count === 2
                }
            )}>
            {children}
        </div>
    )
}

const MediaGridItem = ({
    item,
    extraCount
}: {
    item: MediaData['items'][number]
    extraCount: number | null
}) => {
    const { media, text } = item
    return (
        <AppMediaContainer
            className='relative'
            width={media.width}
            height={media.height}
            blurDataURL={media.blurDataURL}>
            <PreviewItem
                media={media}
                caption={text}>
                <AppImage
                    media={updateSrcIfVideo(media)}
                    className='cursor-zoom-in object-cover'
                />
            </PreviewItem>
            {extraCount && (
                <div className='text-medium pointer-events-none absolute inset-0 flex items-center justify-center bg-black/60 text-3xl text-white backdrop-blur-sm sm:text-4xl md:text-5xl'>
                    +{extraCount}
                </div>
            )}
        </AppMediaContainer>
    )
}
