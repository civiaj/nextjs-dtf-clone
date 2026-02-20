import { memo, useEffect, useId, useState } from 'react'
import Particles, { initParticlesEngine } from '@tsparticles/react'
import { loadSlim } from '@tsparticles/slim'

export const ParticlesSpoiler = memo(({ particlesColor }: { particlesColor: string }) => {
    const [init, setInit] = useState(false)
    const id = useId()

    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine)
        }).then(() => {
            setInit(true)
        })
    }, [])

    return (
        init && (
            <Particles
                className='h-full w-full'
                id={id}
                options={{
                    fpsLimit: 24,
                    fullScreen: { enable: false },
                    background: { color: 'transparent' },
                    detectRetina: true,
                    particles: {
                        number: { value: 30, density: { enable: true, height: 100, width: 100 } },
                        color: { value: particlesColor },
                        opacity: {
                            value: { min: 0, max: 1 },
                            animation: { enable: true, speed: 5, sync: false }
                        },
                        size: { value: 1 },
                        move: {
                            enable: true,
                            speed: 1.4,
                            random: true,
                            outModes: { default: 'bounce' }
                        }
                    }
                }}
            />
        )
    )
})

ParticlesSpoiler.displayName = 'ParticlesSpoiler'
