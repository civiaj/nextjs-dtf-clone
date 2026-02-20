'use client'

import { useState } from 'react'
import { cn } from '@/shared/utils/common.utils'
import { ParticlesSpoiler } from './ParticlesSpoiler'

export const PostBlockSpoiler = ({
    children,
    type = 'regular'
}: {
    children: React.ReactNode
    type?: 'dark' | 'regular'
}) => {
    const [isRevealed, setIsRevealed] = useState(false)
    const [isHidden, setIsHidden] = useState(false)

    const handleClick = () => setIsHidden(true)
    const handleParticlesEnd = () => setIsRevealed(true)

    const particlesColor = type === 'dark' ? '#ffffff' : '#000000'

    return (
        <>
            {children}
            {!isRevealed && (
                <div
                    role='button'
                    className='absolute inset-0'
                    onPointerUp={handleClick}>
                    <div
                        className={cn(
                            `absolute inset-0 overflow-hidden rounded-xl opacity-100 transition-opacity duration-300`,
                            {
                                ['opacity-0']: isHidden,
                                ['bg-card']: type === 'regular',
                                ['isolate bg-neutral-900/60 backdrop-blur-3xl']: type === 'dark'
                            }
                        )}
                    />

                    <div
                        className={cn(`absolute inset-0 transition-opacity duration-700`, {
                            ['opacity-0']: isHidden
                        })}
                        onTransitionEnd={handleParticlesEnd}>
                        <ParticlesSpoiler particlesColor={particlesColor} />
                    </div>
                </div>
            )}
        </>
    )
}
