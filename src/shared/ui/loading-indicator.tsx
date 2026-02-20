'use client'
import { useEffect, useState } from 'react'
import { cn } from '@/shared/utils/common.utils'

const renderDots = (className?: string) =>
    Array.from({ length: 3 }).map((_, index) => (
        <div
            key={index}
            className={cn(
                'h-[4px] w-[4px] animate-pulse rounded-full bg-muted-foreground transition-colors duration-1000 md:h-[6px] md:w-[6px]',
                {
                    ['delay-0']: index === 0,
                    ['delay-100']: index === 1,
                    ['delay-200']: index === 2
                },
                className
            )}></div>
    ))

export const LoadingDots = ({ className }: { className?: string }) => {
    return (
        <div className={cn('flex items-center justify-center gap-1')}>{renderDots(className)}</div>
    )
}

export const Spinner = ({ className }: { className?: string }) => {
    return (
        <div
            className={cn(
                'inline-block h-4 w-4 animate-spin rounded-full border-[3px] border-solid border-current !border-e-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]',
                className
            )}
            role='status'>
            <span className='!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]'>
                Loading...
            </span>
        </div>
    )
}

export const SpinnerProgress = ({ progress, text }: { progress: number; text?: string }) => {
    const [showProcessing, setShowProcessing] = useState(false)

    useEffect(() => {
        if (progress === 100) {
            setShowProcessing(true)
        } else {
            setShowProcessing(false)
        }
    }, [progress])

    return showProcessing ? (
        <LoadingDots className='bg-border' />
    ) : (
        <div className='relative h-8 w-8 animate-spin'>
            <svg
                className='h-full w-full'
                viewBox='0 0 100 100'>
                {/* <!-- Background circle --> */}
                <circle
                    className='stroke-current text-transparent'
                    strokeWidth='10'
                    cx='50'
                    cy='50'
                    r='40'
                    fill='transparent'></circle>
                {/* <!-- Progress circle --> */}
                <circle
                    className='progress-ring__circle stroke-current text-border'
                    strokeWidth='12'
                    cx='50'
                    cy='50'
                    r='40'
                    fill='transparent'
                    strokeDasharray='251.2'
                    strokeDashoffset={`calc(251.2px - (251.2px * ${Math.max(10, progress)}) / 100)`}></circle>

                {/* <!-- Center text --> */}
                {text && (
                    <text
                        x='50'
                        y='50'
                        fontFamily='Verdana'
                        fontSize='12'
                        textAnchor='middle'
                        alignmentBaseline='middle'>
                        {text}
                    </text>
                )}
            </svg>
        </div>
    )
}
