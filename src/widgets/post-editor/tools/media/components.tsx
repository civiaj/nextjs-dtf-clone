import { useEffect, useState } from 'react'
import { MediaToolData } from '@/entities/editor'
import { MediaUploadField } from '@/entities/media'
import { TMediaWithCaption } from '@/shared/types/media.types'

export const EditorBlockMedia = ({
    limit,
    initialData = [],
    onMediaChange
}: {
    limit: number
    initialData: MediaToolData['items']
    onMediaChange: (data: MediaToolData['items']) => void
}) => {
    const [uploaded, setUploaded] = useState<TMediaWithCaption[]>(initialData)

    const onCaptionChange = (id: number, text: string) => {
        setUploaded((prev) =>
            prev.map((file) => {
                if (file.media.id === id) return { ...file, text }
                return file
            })
        )
    }

    useEffect(() => {
        onMediaChange(uploaded)
    }, [uploaded, onMediaChange])

    return (
        <MediaUploadField
            onCaptionChange={onCaptionChange}
            values={uploaded}
            onChange={setUploaded}
            mode='multiple'
            maxFiles={limit}
        />
    )
}
