import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import { TMedia } from '@/shared/types/media.types'
import { FileInput } from '@/shared/ui/FileInput'
import { PreviewContainer } from '@/shared/ui/MediaPreview'
import { MediaAttachmentQueueItem } from './MediaAttachmentQueueItem'

export const MediaAttachmentUpload = forwardRef<MediaAttachmentUploadRef, Props>(
    ({ max = 1, uploadedSize, onCaptionChange, onUploadEnd, onRemove, children }, ref) => {
        const fileInputRef = useRef<HTMLInputElement>(null)
        const [files, setFiles] = useState<QueuedFile[]>([])

        const isFull = uploadedSize + files.length >= max
        const isEmpty = uploadedSize === 0 && files.length === 0

        useImperativeHandle(ref, () => ({
            addFiles: (files: FileList) => handleAddFiles(files),
            openFileInput: () => fileInputRef.current?.click()
        }))

        const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const files = e.target.files
            if (!files || files.length === 0) return
            handleAddFiles(files)
            e.currentTarget.value = ''
        }

        const handleAddFiles = (files: FileList) => {
            const available = max - uploadedSize

            if (available <= 0) return

            const incoming = Array.from(files)
            const cutted = incoming.slice(0, available)
            const nextQueue = cutted.map((file) => ({ id: generateNumericId(), file }))
            setFiles((prev) => [...prev, ...nextQueue])
        }

        const onFileUploadError = (id: number) => {
            setFiles((prev) => prev.filter((item) => item.id !== id))
        }

        const onFileUploadEnd = (data: TMedia, id: number) => {
            setFiles((prev) => prev.filter((item) => item.id !== id))
            onUploadEnd(data)
        }

        const handleAttachmentRemove = (e: React.MouseEvent) => {
            const target = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-remove-id]')
            if (!target) return
            const id = Number(target.getAttribute('data-remove-id'))
            if (Number.isNaN(id)) return

            setFiles((prev) => prev.filter((item) => item.id !== id))
            onRemove?.(id)
        }

        let uploadsSlot: React.ReactElement<UploadedSlot> | null = null
        let buttonSlot: React.ReactElement<ButtonSlot> | null = null

        React.Children.forEach(children, (child) => {
            if (!React.isValidElement(child)) return
            if (child.type === MediaAttachmentUpload.Uploaded)
                uploadsSlot = child as React.ReactElement<UploadedSlot>
            if (child.type === MediaAttachmentUpload.Button) {
                const slot = child as React.ReactElement<ButtonSlot>
                if (typeof slot.props.children === 'function') {
                    const props = { isFull, isEmpty }
                    buttonSlot = slot.props.children(props) as React.ReactElement<ButtonSlot>
                } else {
                    buttonSlot = slot.props.children as React.ReactElement<ButtonSlot>
                }
            }
        })

        return (
            <div onClick={handleAttachmentRemove}>
                <PreviewContainer
                    onCaptionChange={onCaptionChange}
                    className='flex flex-wrap gap-2'>
                    {uploadsSlot}
                    {files.map(({ id, file }) => (
                        <MediaAttachmentQueueItem
                            key={id}
                            id={id}
                            file={file}
                            onFileUploadEnd={onFileUploadEnd}
                            onError={onFileUploadError}
                        />
                    ))}
                    {buttonSlot}
                </PreviewContainer>
                <FileInput
                    ref={fileInputRef}
                    onChange={onFileInputChange}
                    multiple={max === 1 ? false : true}
                />
            </div>
        )
    }
) as MediaAttachmentUploadComponent

MediaAttachmentUpload.Uploaded = ({ children }: UploadedSlot) => children

MediaAttachmentUpload.Button = (({ children }: ButtonSlot) => {
    const isFull = false
    const isEmpty = !isFull

    if (typeof children === 'function') {
        return <>{children({ isFull, isEmpty })}</>
    }

    return <>{children}</>
}) as React.FC<ButtonSlot>

MediaAttachmentUpload.displayName = 'MediaAttachmentQueue'
MediaAttachmentUpload.Uploaded.displayName = 'MediaAttachmentQueue.Uploaded'
MediaAttachmentUpload.Button.displayName = 'MediaAttachmentQueue.Button'

const generateNumericId = () => Date.now() + Math.floor(Math.random() * 10000)

type QueuedFile = { id: number; file: File }
export interface MediaAttachmentUploadRef {
    addFiles: (files: FileList) => void
    openFileInput: () => void
}
export type MediaAttachmentChangeData = { totalSize: number; isEmpty: boolean; isFull: boolean }
type Props = {
    max?: number
    uploadedSize: number
    onCaptionChange?: (id: number, text: string) => void
    onUploadEnd: (data: TMedia) => void
    onRemove: (id: number) => void
    children: React.ReactNode
}
type UploadedSlot = { children: React.ReactNode }
type ButtonSlot = {
    children: React.ReactNode | ((props: { isFull: boolean; isEmpty: boolean }) => React.ReactNode)
}

interface MediaAttachmentUploadComponent
    extends React.ForwardRefExoticComponent<Props & React.RefAttributes<MediaAttachmentUploadRef>> {
    Uploaded: React.FC<UploadedSlot>
    Button: React.FC<ButtonSlot>
}
