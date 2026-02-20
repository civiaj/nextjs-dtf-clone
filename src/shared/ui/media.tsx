'use client'

import { HTMLAttributes, useEffect, useRef, useState } from 'react'
import Image, { ImageProps } from 'next/image'
import { TMedia } from '@/shared/types/media.types'
import { cn } from '@/shared/utils/common.utils'

export const AppImage = ({
    className,
    media,
    ...attrs
}: {
    className?: string
    media: Partial<TMedia>
} & Partial<ImageProps>) => {
    const [isLoaded, setIsLoaded] = useState(false)

    if (!media.src) return null

    return (
        <div className='relative h-full w-full'>
            <Image
                draggable={false}
                alt=''
                src={media.src}
                sizes='(max-width: 640px) 100vw, (max-width: 768px) 90vw, (max-width: 1024px) 75vw, (max-width: 1280px) 60vw, 50vw'
                fill
                className={cn(
                    'h-full w-full select-none opacity-0 transition-opacity will-change-[opacity]',
                    { 'opacity-100': isLoaded },
                    className
                )}
                onLoad={() => setIsLoaded(true)}
                {...attrs}
            />
        </div>
    )
}

export const AppVideo = ({
    className,
    media,
    showControlsOnHover = true,
    ...attrs
}: {
    className?: string
    media: TMedia
    showControlsOnHover?: boolean
} & HTMLAttributes<HTMLVideoElement>) => {
    const [isLoaded, setIsLoaded] = useState(false)
    const [isTouched, setIsTouched] = useState(false)
    const [isHovered, setIsHovered] = useState(false)

    const videoRef = useRef<HTMLVideoElement>(null)
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    const handleTouchStart = () => setIsTouched((p) => !p)
    const handleMouseEnter = () => setIsHovered(true)
    const handleMouseLeave = () => setIsHovered(false)
    const shouldShowControls =
        (showControlsOnHover ? isHovered || isTouched : false) && media.format !== 'gif'

    useEffect(() => {
        const video = videoRef.current
        if (!video) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    video.play().catch()
                } else {
                    video.pause()
                }
            },
            {
                root: null,
                threshold: 0.5
            }
        )
        observer.observe(video)
        return () => {
            observer.disconnect()
        }
    }, [])

    useEffect(() => {
        if (isTouched) {
            timeoutRef.current = setTimeout(() => {
                setIsTouched(false)
            }, 3000)
        }
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current)
        }
    }, [isTouched])

    return (
        <video
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            controls={shouldShowControls}
            draggable={false}
            ref={videoRef}
            loop
            playsInline
            muted
            preload='metadata'
            src={media.src}
            className={cn(
                'h-full w-full select-none object-contain opacity-0 transition-opacity will-change-[opacity]',
                { ['opacity-100']: isLoaded },
                className
            )}
            onLoadedData={() => setIsLoaded(true)}
            onPlay={() => setIsLoaded(true)}
            {...attrs}
        />
    )
}

export const AppMediaContainer = ({
    className,
    underlayClassName,
    blurDataURL,
    width,
    height,
    maxHeight,
    children
}: {
    blurDataURL: string
    width: number
    height: number
    maxHeight?: number
    underlayClassName?: string
    className?: string
    children: React.ReactNode
}) => {
    const aspectRatio = Math.floor((width / height) * 10000) / 10000
    const maxWidth = maxHeight ? Math.floor(Math.min(width, aspectRatio * maxHeight)) : 'none'

    return (
        <div
            className={cn(
                'relative isolate grid transform-gpu grid-cols-1 grid-rows-1',
                { 'h-full': maxHeight === undefined },
                className
            )}>
            <div
                className={cn(
                    'col-span-full row-span-full bg-cover bg-center bg-no-repeat',
                    underlayClassName
                )}
                style={{ backgroundImage: `url(${blurDataURL})` }}
            />

            <div
                className={cn('relative col-span-full row-span-full w-full', {
                    ['mx-auto self-center']: maxHeight !== undefined,
                    'h-full': maxHeight === undefined
                })}
                style={{ aspectRatio, maxWidth }}>
                {children}
            </div>
        </div>
    )
}

export const CommentMediaContainer = ({
    className,
    blurDataURL,
    width,
    height,
    maxHeight,
    children
}: {
    blurDataURL: string
    width: number
    height: number
    maxHeight?: number
    className?: string
    children: React.ReactNode
}) => {
    const aspectRatio = Math.floor((width / height) * 10000) / 10000

    return (
        <div
            className={cn(
                'isolate grid max-h-[300px] grid-cols-[minmax(0,400px)] grid-rows-1',
                { 'h-full': maxHeight === undefined },
                className
            )}>
            <div
                className='col-span-full row-span-full bg-cover bg-center bg-no-repeat'
                style={{ backgroundImage: `url(${blurDataURL})` }}
            />

            <div
                className={cn('relative col-span-full row-span-full h-full w-full', {})}
                style={{ aspectRatio }}>
                {children}
            </div>
        </div>
    )
}
