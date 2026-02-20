'use client'

import { memo, useEffect, useRef, useState } from 'react'
import { usePrevious } from '@/shared/hooks'
import { cn } from '@/shared/utils/common.utils'

export const AnimatedNumber = memo(
    ({
        duration = 0.22,
        className,
        value,
        isSlot = false
    }: {
        value: number
        className?: string
        duration?: number
        isSlot?: boolean
    }) => {
        const safeValue = Math.max(0, value)
        const prevValue = usePrevious(safeValue)

        if (safeValue === 0 && !isSlot) return null

        const currString = safeValue.toString()
        const prevString = (prevValue ?? safeValue).toString().padStart(currString.length, '0')

        const hasPrevValue = prevValue !== undefined && prevValue !== null
        const direction = hasPrevValue
            ? safeValue > prevValue
                ? 1
                : safeValue < prevValue
                  ? -1
                  : 0
            : 0

        return (
            <div className='inline-flex tabular-nums'>
                {currString.split('').map((digitChar, index) => (
                    <AnimatedDigit
                        key={`${index}-${safeValue}`}
                        from={Number(prevString[index])}
                        to={Number(digitChar)}
                        index={index}
                        direction={direction}
                        duration={duration}
                        className={className}
                    />
                ))}
            </div>
        )
    }
)

type AnimatedDigitProps = {
    from: number
    to: number
    index: number
    direction: -1 | 0 | 1
    duration: number
    className?: string
}

const normalizeDigit = (value: number) => ((value % 10) + 10) % 10

const AnimatedDigit = ({ from, to, index, direction, duration, className }: AnimatedDigitProps) => {
    const [displayDigit, setDisplayDigit] = useState(to)
    const rafRef = useRef<number | null>(null)

    useEffect(() => {
        if (rafRef.current !== null) {
            cancelAnimationFrame(rafRef.current)
            rafRef.current = null
        }

        if (direction === 0) {
            setDisplayDigit(to)
            return
        }

        const turns = Math.min(3, 1 + Math.floor(index / 2))
        const delta = direction > 0 ? (to - from + 10) % 10 : (from - to + 10) % 10
        const totalSteps = turns * 10 + delta
        const totalDurationMs =
            (duration + Math.min(0.45, index * 0.08 + (turns - 1) * 0.12)) * 1000
        const startedAt = performance.now()
        let lastStep = -1

        const tick = (time: number) => {
            const progress = Math.min(1, (time - startedAt) / totalDurationMs)
            const step = Math.min(totalSteps, Math.floor(progress * totalSteps))

            if (step !== lastStep) {
                lastStep = step
                setDisplayDigit(normalizeDigit(from + direction * step))
            }

            if (progress < 1) {
                rafRef.current = requestAnimationFrame(tick)
                return
            }

            setDisplayDigit(to)
            rafRef.current = null
        }

        rafRef.current = requestAnimationFrame(tick)

        return () => {
            if (rafRef.current !== null) {
                cancelAnimationFrame(rafRef.current)
                rafRef.current = null
            }
        }
    }, [from, to, index, direction, duration])

    return (
        <span
            className={cn(
                'relative inline-flex h-[1em] w-[1ch] overflow-hidden leading-none',
                className
            )}>
            <span className='absolute left-0 top-0 block h-[1em] w-[1ch]'>{displayDigit}</span>
        </span>
    )
}

AnimatedNumber.displayName = 'AnimatedNumber'
