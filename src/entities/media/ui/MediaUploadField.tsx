'use client'

/* eslint-disable @next/next/no-img-element */

import { forwardRef, useCallback, useImperativeHandle, useRef, useState } from 'react'
import { CloseAppIcon, FileAppIcon, PlusAppIcon } from '@/shared/icons'
import { TMediaWithCaption } from '@/shared/types/media.types'
import { SpinnerProgress } from '@/shared/ui/loading-indicator'
import { PreviewContainer, PreviewItem } from '@/shared/ui/MediaPreview'
import { Text } from '@/shared/ui/text'
import { cn } from '@/shared/utils/common.utils'
import { getNoun } from '@/shared/utils/string.utils'
import { useMediaUploadQueue } from '../model/hooks/useMediaUploadQueue'
import { MediaUploadQueueItem, UseMediaUploadQueueParams } from '../model/types'

export type MediaUploadFieldProps = UseMediaUploadQueueParams & {
    className?: string
    onCaptionChange?: (id: number, text: string) => void
    showPicker?: boolean
    allowDragAndDrop?: boolean
}

export type MediaUploadFieldRef = {
    openFileDialog: () => void
    addFiles: (files: FileList | readonly File[] | null | undefined) => void
}

export const MediaUploadField = forwardRef<MediaUploadFieldRef, MediaUploadFieldProps>(
    ({ className, ...params }, ref) => {
        const {
            values,
            disabled = false,
            mode,
            maxFiles,
            onCaptionChange,
            showPicker = true,
            allowDragAndDrop = true
        } = params

        const {
            addFiles,
            removeUploaded,
            removeQueueItem,
            retryQueueItem,
            cancelQueueItem,
            queue,
            isAtLimit,
            isEmpty,
            remainingSlots,
            acceptAttribute
        } = useMediaUploadQueue(params)

        const inputRef = useRef<HTMLInputElement>(null)
        const dragDepthRef = useRef(0)
        const [isDragOver, setIsDragOver] = useState(false)

        const resolvedMode = mode ?? ((maxFiles ?? 1) > 1 ? 'multiple' : 'single')

        const openFileDialog = useCallback(() => {
            if (disabled || isAtLimit) return
            inputRef.current?.click()
        }, [disabled, isAtLimit])

        const addFilesFromOutside = useCallback(
            (files: FileList | readonly File[] | null | undefined) => {
                if (disabled || isAtLimit) return
                addFiles(files)
            },
            [disabled, isAtLimit, addFiles]
        )

        useImperativeHandle(
            ref,
            () => ({
                openFileDialog,
                addFiles: addFilesFromOutside
            }),
            [addFilesFromOutside, openFileDialog]
        )

        const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            addFilesFromOutside(event.currentTarget.files)
            event.currentTarget.value = ''
        }

        const handleDragEnter = (event: React.DragEvent<HTMLButtonElement>) => {
            event.preventDefault()
            if (!allowDragAndDrop || disabled || isAtLimit) return

            dragDepthRef.current += 1
            setIsDragOver(true)
        }

        const handleDragOver = (event: React.DragEvent<HTMLButtonElement>) => {
            event.preventDefault()
        }

        const handleDragLeave = (event: React.DragEvent<HTMLButtonElement>) => {
            event.preventDefault()
            if (!allowDragAndDrop) return

            dragDepthRef.current = Math.max(0, dragDepthRef.current - 1)

            if (dragDepthRef.current === 0) {
                setIsDragOver(false)
            }
        }

        const handleDrop = (event: React.DragEvent<HTMLButtonElement>) => {
            event.preventDefault()
            if (!allowDragAndDrop) return

            dragDepthRef.current = 0
            setIsDragOver(false)
            addFilesFromOutside(event.dataTransfer.files)
        }

        return (
            <PreviewContainer onCaptionChange={onCaptionChange}>
                <div className={className}>
                    <input
                        ref={inputRef}
                        type='file'
                        className='hidden'
                        accept={acceptAttribute || undefined}
                        multiple={resolvedMode === 'multiple'}
                        onChange={handleInputChange}
                    />

                    <ul className='flex flex-wrap items-start justify-start gap-2'>
                        {values.map((value) => (
                            <UploadedItemCard
                                key={`uploaded-${value.media.id}`}
                                value={value}
                                onRemove={() => removeUploaded(value.media.id)}
                                disabled={disabled}
                            />
                        ))}
                        {queue.map((item) => (
                            <QueueItemCard
                                key={`queue-${item.id}`}
                                item={item}
                                disabled={disabled}
                                onCancel={() => cancelQueueItem(item.id)}
                                onRetry={() => retryQueueItem(item.id)}
                                onRemove={() => removeQueueItem(item.id)}
                            />
                        ))}
                        {showPicker && !isAtLimit && (
                            <button
                                type='button'
                                onClick={openFileDialog}
                                onDragEnter={handleDragEnter}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                disabled={disabled || isAtLimit}
                                className={cn(
                                    'relative flex shrink-0 items-center justify-center rounded-xl text-muted-foreground ring-2 ring-border hover:text-active hover:ring-active',
                                    {
                                        ['h-48 w-full sm:h-52']: isEmpty,
                                        ['h-24 w-24 sm:h-32 sm:w-32']: !isEmpty,
                                        ['text-active ring-active']: allowDragAndDrop && isDragOver,
                                        'cursor-not-allowed opacity-60': disabled || isAtLimit,
                                        'cursor-pointer hover:border-active hover:bg-muted/40':
                                            !disabled && !isAtLimit
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
                        )}
                    </ul>
                    {showPicker && !isEmpty && (
                        <Text className='mt-2 text-xs font-medium text-muted-foreground'>
                            {remainingSlots > 0
                                ? `Вы можете добавить ещё ${remainingSlots} ${getNoun(remainingSlots, 'файл', 'файла', 'файлов')}`
                                : 'Достигнут лимит файлов'}
                        </Text>
                    )}
                </div>
            </PreviewContainer>
        )
    }
)

MediaUploadField.displayName = 'MediaUploadField'

const UploadedItemCard = ({
    value,
    disabled,
    onRemove
}: {
    value: TMediaWithCaption
    disabled: boolean
    onRemove: () => void
}) => {
    return (
        <li className='relative h-24 w-24 overflow-hidden rounded-xl border border-border bg-background sm:h-32 sm:w-32'>
            <button
                type='button'
                disabled={disabled}
                onClick={onRemove}
                className='absolute right-1 top-1 z-[1] flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white hover:text-destructive'>
                <CloseAppIcon
                    size={16}
                    strokeWidth={3}
                />
            </button>
            <UploadedPreview value={value} />
        </li>
    )
}

const QueueItemCard = ({
    item,
    disabled,
    onRemove
}: {
    item: MediaUploadQueueItem
    disabled: boolean
    onCancel: () => void
    onRetry: () => void
    onRemove: () => void
}) => {
    const isUploading = item.status === 'uploading'
    const isError = item.status === 'aborted' || item.status === 'error'

    return (
        <li className='relative h-24 w-24 overflow-hidden rounded-xl border border-border bg-background sm:h-32 sm:w-32'>
            <QueuePreview item={item} />
            <button
                type='button'
                disabled={disabled}
                onClick={onRemove}
                className='absolute right-1 top-1 z-[1] flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white hover:text-destructive'>
                <CloseAppIcon
                    size={16}
                    strokeWidth={3}
                />
            </button>
            <div className='absolute inset-0 bg-neutral-800/30 backdrop-blur-sm'>
                <div className='flex h-full w-full items-center justify-center'>
                    {isUploading && <SpinnerProgress progress={item.progress} />}
                    {isError && (
                        <p className='text-center text-xs text-white'>
                            Ошибка: {item.error?.message}
                        </p>
                    )}
                </div>
            </div>
        </li>
    )
}

const UploadedPreview = ({ value }: { value: TMediaWithCaption }) => {
    let children = null
    const className = 'h-full w-full cursor-zoom-in object-cover'

    if (value.media.type === 'video') {
        if (value.media.thumbnail) {
            children = (
                <img
                    src={value.media.thumbnail}
                    alt=''
                    className={className}
                />
            )
        } else {
            children = (
                <video
                    src={value.media.src}
                    muted
                    playsInline
                    preload='metadata'
                    className={className}
                />
            )
        }
    } else {
        children = (
            <img
                src={value.media.src}
                alt=''
                className={className}
            />
        )
    }

    return (
        <PreviewItem
            caption={value.text}
            media={value.media}>
            {children}
        </PreviewItem>
    )
}

const QueuePreview = ({ item }: { item: MediaUploadQueueItem }) => {
    if (!item.previewUrl) return null

    if (item.file.type.startsWith('video/')) {
        return (
            <video
                src={item.previewUrl}
                muted
                playsInline
                preload='metadata'
                className='h-full w-full object-cover'
            />
        )
    }

    return (
        <img
            src={item.previewUrl}
            alt=''
            className='h-full w-full object-cover'
        />
    )
}
