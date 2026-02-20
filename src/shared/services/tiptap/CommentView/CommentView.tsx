import { Extensions, generateHTML } from '@tiptap/core'
import { TComment } from '@/shared/types/comment.types'
import { TMedia } from '@/shared/types/media.types'
import { AppImage, AppVideo } from '@/shared/ui/media'
import { PreviewContainer, PreviewItem } from '@/shared/ui/MediaPreview'

export const CommentView = ({
    json,
    media,
    extensions
}: Pick<TComment, 'media' | 'json'> & { extensions: Extensions }) => {
    return (
        <>
            <CommentJson
                json={json}
                extensions={extensions}
            />
            <CommentMedia media={media} />
        </>
    )
}

const CommentJson = ({ json, extensions }: Pick<TComment, 'json'> & { extensions: Extensions }) => {
    if (!json) return null
    const html = generateHTML(json, extensions)

    return (
        <div
            className='tiptap-renderer mb-2 mt-2 space-y-2'
            dangerouslySetInnerHTML={{ __html: html }}></div>
    )
}

const CommentMedia = ({ media }: { media: TMedia | null }) => {
    if (!media) return null

    const aspectRatio = media.width / media.height
    const mediaSizeStyle = {
        aspectRatio,
        ['--media-width' as string]: `${media.width}px`,
        ['--media-ratio' as string]: String(aspectRatio)
    }

    const mediaSizeClassName =
        'w-[min(var(--media-width),calc(200px*var(--media-ratio)),200px)] sm:w-[min(var(--media-width),calc(300px*var(--media-ratio)),300px)]'

    if (media.type === 'image') {
        return (
            <PreviewContainer
                style={mediaSizeStyle}
                className={`mt-2 grid max-h-[200px] max-w-[200px] grid-cols-1 grid-rows-1 overflow-hidden border border-border sm:max-h-[300px] sm:max-w-[300px] ${mediaSizeClassName}`}>
                <div
                    className='col-span-full row-span-full bg-cover bg-center bg-no-repeat'
                    style={{ backgroundImage: `url(${media.blurDataURL})` }}
                />
                <div className='col-span-full row-span-full'>
                    <PreviewItem media={media}>
                        <AppImage
                            media={media}
                            className='cursor-zoom-in object-scale-down'
                        />
                    </PreviewItem>
                </div>
            </PreviewContainer>
        )
    }

    if (media.type === 'video')
        return (
            <div
                style={mediaSizeStyle}
                className={`mt-2 grid max-h-[200px] max-w-[200px] grid-cols-1 grid-rows-1 overflow-hidden border border-border sm:max-h-[300px] sm:max-w-[300px] ${mediaSizeClassName}`}>
                <div
                    className='col-span-full row-span-full bg-cover bg-center bg-no-repeat'
                    style={{ backgroundImage: `url(${media.blurDataURL})` }}
                />
                <AppVideo
                    media={media}
                    className='col-span-full row-span-full'
                />
            </div>
        )
    return null
}
