import { useEffect, useRef, useState } from 'react'
import { MediaToolData } from '@/entities/editor'
import {
    MediaAttachmentItem,
    MediaAttachmentUpload,
    MediaAttachmentUploadRef
} from '@/entities/media'
import { FileAppIcon, PlusAppIcon } from '@/shared/icons'
import { TMedia } from '@/shared/types/media.types'
import { cn } from '@/shared/utils/common.utils'

export const EditorBlockMedia = ({
    limit,
    initialData = [],
    onMediaChange
}: {
    limit: number
    initialData: MediaToolData['items']
    onMediaChange: (data: MediaToolData['items']) => void
}) => {
    const [uploaded, setUploaded] = useState<MediaToolData['items']>(initialData)

    const attachmentRef = useRef<MediaAttachmentUploadRef>(null)

    const onCaptionChange = (id: number, text: string) => {
        setUploaded((prev) =>
            prev.map((file) => {
                if (file.media.id === id) return { ...file, text }
                return file
            })
        )
    }

    const onRemove = (id: number) => {
        setUploaded((prev) => prev.filter((item) => item.media.id !== id))
    }

    const onUploadEnd = (data: TMedia) => {
        setUploaded((prev) => {
            const exists = prev.find((item) => item.media.id === data.id)
            if (exists) return prev
            return [...prev, { media: data, text: '' }] as MediaToolData['items']
        })
    }

    useEffect(() => {
        onMediaChange(uploaded.map(({ media, text }) => ({ media, text })))
    }, [uploaded, onMediaChange])

    return (
        <MediaAttachmentUpload
            ref={attachmentRef}
            max={limit}
            onCaptionChange={onCaptionChange}
            onRemove={onRemove}
            onUploadEnd={onUploadEnd}
            uploadedSize={uploaded.length}>
            <MediaAttachmentUpload.Uploaded>
                {uploaded.map(({ media, text }) => (
                    <MediaAttachmentItem
                        previewAvailable
                        key={media.id}
                        caption={text}
                        id={media.id}
                        type={media.type}
                        src={media.src}
                        height={media.height}
                        width={media.width}
                        blurDataURL={media.blurDataURL}
                        thumbnail={media.thumbnail}
                        duration={media.duration}
                    />
                ))}
            </MediaAttachmentUpload.Uploaded>
            <MediaAttachmentUpload.Button>
                {({ isFull, isEmpty }) =>
                    !isFull && (
                        <AddMediaButton
                            isEmpty={isEmpty}
                            onClick={() => attachmentRef.current?.openFileInput()}
                            onDrop={(files) => attachmentRef.current?.addFiles(files)}
                        />
                    )
                }
            </MediaAttachmentUpload.Button>
        </MediaAttachmentUpload>
    )
}

const AddMediaButton = ({
    onClick,
    onDrop,
    isEmpty
}: {
    isEmpty: boolean
    onClick: () => void
    onDrop: (files: FileList) => void
}) => {
    const [dragTarget, setDragTarget] = useState(0)
    const containerRef = useRef<HTMLButtonElement>(null)

    const onDragEnter = (e: React.DragEvent<HTMLButtonElement>) => {
        e.preventDefault()
        setDragTarget((p) => p + 1)
    }

    const onDragLeave = (e: React.DragEvent<HTMLButtonElement>) => {
        e.preventDefault()
        setDragTarget((p) => p - 1)
    }

    const handleDrop = (e: React.DragEvent<HTMLButtonElement>) => {
        e.preventDefault()
        setDragTarget(0)
        const files = e.dataTransfer.files
        onDrop(files)
    }

    return (
        <button
            ref={containerRef}
            onDragStart={(e) => e.preventDefault()}
            onDragEnter={onDragEnter}
            onDragLeave={onDragLeave}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={onClick}
            className={cn(
                'relative flex h-20 w-20 shrink-0 items-center justify-center rounded-xl text-muted-foreground ring-2 ring-border hover:text-active hover:ring-active sm:h-28 sm:w-28',
                {
                    ['h-48 w-full sm:h-52 sm:w-full']: isEmpty,
                    ['text-active ring-active']: dragTarget > 0
                }
            )}>
            {isEmpty ? (
                <div className='flex flex-col items-center gap-2 text-sm'>
                    <FileAppIcon size={20} />
                    Для загрузки файлов перенесите их сюда или выберите вручную.
                </div>
            ) : (
                <PlusAppIcon
                    size={40}
                    strokeWidth={1}
                />
            )}
        </button>
    )
}
