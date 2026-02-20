'use client'

import { useLayoutEffect, useState } from 'react'
import Link from 'next/link'
import ReactPlayer from 'react-player'
import { LinkToolData } from '@/entities/editor'
import { Text } from '@/shared/ui/text'
import { cn } from '@/shared/utils/common.utils'

/* eslint-disable @next/next/no-img-element */

export const RichContent = (props: LinkToolData & { className?: string }) => {
    const isPlayable = ReactPlayer.canPlay(props.url)
    return isPlayable ? <RichPlayer {...props} /> : <RichLink {...props} />
}

const RichPlayer = (props: LinkToolData & { className?: string }) => {
    const [hasWindow, setHasWindow] = useState(false)

    useLayoutEffect(() => {
        if (typeof window !== 'undefined') {
            setHasWindow(true)
        }
    }, [])

    const [hasInteracted, setHasInteracted] = useState(false)

    return (
        <div
            className={cn(
                'relative aspect-video w-full overflow-hidden rounded-xl bg-background',
                props.className
            )}>
            {!hasInteracted && (
                <div className='pointer-events-none absolute left-2 right-2 top-2'>
                    <div className='inline-block max-w-full rounded-md bg-neutral-800/80 px-2 py-1'>
                        <div className='flex items-center gap-2'>
                            <img
                                src={props.image.src}
                                alt=''
                                className='h-6'
                            />
                            <Text
                                as='p'
                                className='truncate text-xs font-medium text-white md:text-sm'>
                                {props.title || props.hostname}
                            </Text>
                        </div>
                    </div>
                </div>
            )}
            {hasWindow && (
                <ReactPlayer
                    light={!hasInteracted}
                    playing={hasInteracted}
                    onClickPreview={() => setHasInteracted(true)}
                    url={props.url}
                    controls
                    width='100%'
                    height='100%'
                />
            )}
        </div>
    )
}

const RichLink = ({
    description,
    hostname,
    image,
    title,
    url,
    className
}: LinkToolData & { className?: string }) => {
    return (
        <div
            className={cn(
                'relative flex items-center gap-4 rounded-xl border px-2 py-2 hover:bg-accent md:px-4',
                className
            )}>
            <img
                className='max-h-10 max-w-10 rounded-md'
                src={image.src}
                alt=''
            />
            <div className='flex-1 overflow-hidden'>
                <Text
                    as='p'
                    className='truncate text-xs text-muted-foreground md:text-sm'>
                    {hostname}
                </Text>
                <Text
                    as='p'
                    className='truncate font-medium'>
                    {description || title || url}
                </Text>
            </div>
            <Link
                className='absolute inset-0 rounded-md outline-blue-500/50'
                target='_blank'
                href={url}
            />
        </div>
    )
}
