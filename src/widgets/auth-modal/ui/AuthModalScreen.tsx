import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ModalWrapperRegular } from '@/shared/ui/modal'
import { LoginScreen } from './LoginScreen'
import { SignupScreen } from './SignupScreen'
import { useAuthModalActions } from '../model/hooks/useAuthModalActions'

export const AuthModalSceen = ({
    isLoginScreen,
    isSignupScreen
}: {
    isLoginScreen: boolean
    isSignupScreen: boolean
}) => {
    const { closeModal } = useAuthModalActions()
    const screen = isLoginScreen ? 'login' : isSignupScreen ? 'signup' : null
    const direction = isLoginScreen ? -1 : 1

    const containerRef = useRef<HTMLDivElement | null>(null)
    const [height, setHeight] = useState<number | 'auto'>('auto')

    useEffect(() => {
        if (containerRef.current) {
            const ro = new ResizeObserver((entries) => {
                setHeight(entries[0].contentRect.height)
            })
            ro.observe(containerRef.current)
            return () => {
                ro.disconnect()
            }
        }
    }, [screen])

    return (
        <ModalWrapperRegular
            onCloseModal={closeModal}
            className='max-w-[400px]'>
            <motion.div
                style={{ height }}
                animate={{ height }}
                transition={{ duration: 0.2 }}>
                <div ref={containerRef}>
                    <AnimatePresence
                        initial={false}
                        custom={direction}
                        mode='wait'>
                        <motion.div
                            key={screen}
                            custom={direction}
                            variants={variants}
                            initial={'enter'}
                            animate='center'
                            exit='exit'
                            transition={{ duration: 0.1 }}>
                            {screen === 'login' ? <LoginScreen /> : <SignupScreen />}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </motion.div>
        </ModalWrapperRegular>
    )
}

const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 50 : -50, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -50 : 50, opacity: 0 })
}
