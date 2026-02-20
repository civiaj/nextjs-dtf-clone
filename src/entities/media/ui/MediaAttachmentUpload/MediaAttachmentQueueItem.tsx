import { memo, useCallback, useEffect } from 'react'
import { TMedia } from '@/shared/types/media.types'
import { MediaAttachmentItem } from '../MediaAttachmentItem'
import { MediaAttachmentQueueItemProgress } from './MediaAttachmentQueueItemProgress'
import { useMediaFilePreview } from '../../model/hooks/useMediaFilePreview'
import { useMediaUpload } from '../../model/hooks/useMediaUpload'

export const MediaAttachmentQueueItem = memo(
    ({
        id,
        file,
        onError,
        onFileUploadEnd
    }: {
        id: number
        file: File
        onError: (id: number) => void
        onFileUploadEnd: (data: TMedia, id: number) => void
    }) => {
        const onSuccess = useCallback(
            (data: TMedia) => onFileUploadEnd(data, id),
            [onFileUploadEnd, id]
        )

        const handleError = useCallback(() => onError(id), [onError, id])
        const { abort, isLoading, progress, upload } = useMediaUpload(onSuccess, handleError)
        const previewUrl = useMediaFilePreview(file)

        useEffect(() => {
            upload({ file })
            return () => abort()
        }, [abort])

        return (
            previewUrl && (
                <MediaAttachmentItem
                    previewAvailable={false}
                    type='image'
                    src={previewUrl}
                    id={id}>
                    {isLoading && <MediaAttachmentQueueItemProgress progress={progress} />}
                </MediaAttachmentItem>
            )
        )
    }
)

MediaAttachmentQueueItem.displayName = 'MediaAttachmentQueueItem'
