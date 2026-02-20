import { cloneElement, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useInert } from '@/shared/hooks'
import { CloseAppIcon } from '@/shared/icons'
import { Container } from '@/shared/ui/box'
import { Button } from '@/shared/ui/button'
import { ScrollArea } from '@/shared/ui/scroll-area'
import { cn } from '@/shared/utils/common.utils'

export const Modal = ({
    children,
    className,
    onCloseModal,
    preventAnimation = false
}: {
    children: React.ReactElement<React.HTMLAttributes<HTMLDivElement>>
    className?: string
    onCloseModal: () => void
    preventAnimation?: boolean
}) => {
    const [domReady, setDomReady] = useState(false)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        setDomReady(true)

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onCloseModal()
            }
        }

        document.addEventListener('keydown', onKeyDown)
        return () => {
            document.removeEventListener('keydown', onKeyDown)
        }
    }, [onCloseModal])

    useEffect(() => {
        if (domReady) {
            requestAnimationFrame(() => setIsVisible(true))
        }
    }, [domReady])

    useInert()

    if (!domReady) return null

    const Component = (
        <div
            className={cn(
                'fixed inset-0 z-50 flex select-none items-end justify-center sm:items-center',
                className
            )}>
            {cloneElement(children, {
                className: cn(
                    'z-[2]',
                    {
                        ['transition-all sm:translate-y-0 ease-out relative ']: !preventAnimation,
                        ['translate-y-0']: !preventAnimation && isVisible,
                        ['translate-y-full']: !preventAnimation && !isVisible
                    },
                    children.props?.className
                )
            })}

            <div
                onClick={onCloseModal}
                className='overlay'
            />
        </div>
    )

    const modalNode = document.getElementById('modal')!
    return createPortal(Component, modalNode)
}

export const ModalWrapperRegular = ({
    onCloseModal,
    children,
    insideScrollContainer = true,
    className
}: {
    onCloseModal: () => void
    children: React.ReactNode
    insideScrollContainer?: boolean
    className?: string
}) => {
    return (
        <Modal onCloseModal={onCloseModal}>
            <Container
                withBottom={false}
                className={cn(
                    'mb-0 w-full max-w-[600px] flex-col overflow-hidden rounded-xl rounded-bl-none rounded-br-none bg-card sm:rounded-xl',
                    className
                )}>
                <Button
                    onClick={onCloseModal}
                    variant={'ghost'}
                    size={'icon-md'}
                    rounedness={'full'}
                    className='absolute right-2 top-2 z-[2]'>
                    <CloseAppIcon size={20} />
                </Button>
                {insideScrollContainer ? (
                    <ScrollArea type='always'>
                        <div className='flex max-h-[90vh] flex-col'>{children}</div>
                    </ScrollArea>
                ) : (
                    children
                )}
            </Container>
        </Modal>
    )
}
