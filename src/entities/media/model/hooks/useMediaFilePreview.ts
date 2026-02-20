import { useEffect, useState } from 'react'

export const useMediaFilePreview = (file: File) => {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)

    useEffect(() => {
        let cleanup: () => void

        if (file.type.startsWith('image')) {
            const url = URL.createObjectURL(file)
            setPreviewUrl(url)
            cleanup = () => URL.revokeObjectURL(url)
        } else if (file.type.startsWith('video')) {
            generateVideoThumbnail(file).then((imgUrl) => {
                setPreviewUrl(imgUrl)
                cleanup = () => URL.revokeObjectURL(imgUrl)
            })
        }

        return () => cleanup?.()
    }, [file])

    return previewUrl
}

const generateVideoThumbnail = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const url = URL.createObjectURL(file)
        const video = document.createElement('video')

        video.preload = 'metadata'
        video.src = url
        video.muted = true
        video.playsInline = true

        video.addEventListener('loadeddata', () => {
            video.currentTime = 0.1
        })

        video.addEventListener('seeked', () => {
            const canvas = document.createElement('canvas')
            canvas.width = video.videoWidth
            canvas.height = video.videoHeight
            const ctx = canvas.getContext('2d')

            if (!ctx) {
                URL.revokeObjectURL(url)
                reject(new Error('Canvas context not available'))
                return
            }

            ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
            URL.revokeObjectURL(url)

            canvas.toBlob((blob) => {
                if (blob) {
                    const imgUrl = URL.createObjectURL(blob)
                    resolve(imgUrl)
                } else {
                    reject(new Error('Failed to create thumbnail blob'))
                }
            }, 'image/png')
        })

        video.addEventListener('error', (e) => {
            URL.revokeObjectURL(url)
            reject(e)
        })
    })
}
