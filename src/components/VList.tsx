'use client'

import React, {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useLayoutEffect,
    useRef,
    useState
} from 'react'
import {
    PartialKeys,
    ScrollToOptions,
    useVirtualizer,
    useWindowVirtualizer,
    VirtualItem,
    VirtualizerOptions
} from '@tanstack/react-virtual'
import { useIntersectionObserver } from '@/shared/hooks'
import { MessageContainer } from '@/shared/ui/box'
import { ErrorMessage } from '@/shared/ui/error-message'
import { LoadingDots } from '@/shared/ui/loading-indicator'
import { cn } from '@/shared/utils/common.utils'

const EMPTY_MESSAGE = 'Здесь пока ничего нет.'

type VirtualizerWindowArgs = PartialKeys<
    VirtualizerOptions<Window, Element>,
    'getScrollElement' | 'observeElementRect' | 'observeElementOffset' | 'scrollToFn'
>

type VirtualizerContainerArgs = PartialKeys<
    VirtualizerOptions<HTMLDivElement, Element>,
    'observeElementRect' | 'observeElementOffset' | 'scrollToFn' | 'getScrollElement'
>

type VListRef = {
    scrollToIndex: (index: number, options?: ScrollToOptions) => void
}

type VListCommonProps = {
    renderItem: (vItem: VirtualItem) => React.ReactElement
    overscan?: number
}

type VListWindowProps = {
    mode?: 'window'
} & VListCommonProps &
    VirtualizerWindowArgs

type VListContainerProps = {
    mode: 'container'
    containerClassName?: string
} & VListCommonProps &
    VirtualizerContainerArgs

type VListProps = VListWindowProps | VListContainerProps

type InfiniteCommonProps = {
    onScrollEnd: () => void
    hasNextPage: boolean
    isLoading: boolean
    isError: boolean
    isSuccess: boolean
    error: unknown
    showEmptyMessage?: boolean
    isEmptyMessageContainered?: boolean
    showSkeleton?: boolean
    Skeleton?: React.ReactElement
}

type InfiniteVListProps = InfiniteCommonProps & VListProps

type VListWindowCoreProps = Omit<VListWindowProps, 'mode'> & {
    footer?: React.ReactNode
}

const VListWindowCore = forwardRef<VListRef, VListWindowCoreProps>(
    ({ overscan = 5, renderItem, ...other }, ref) => {
        const containerRef = useRef<HTMLDivElement | null>(null)
        const [scrollMargin, setScrollMargin] = useState(0)
        const [scrollPaddingStart, setScrollPaddingStart] = useState(0)

        const virtualizer = useWindowVirtualizer({
            overscan,
            scrollMargin,
            scrollPaddingStart,

            ...other
        })
        const items = virtualizer.getVirtualItems()

        useImperativeHandle(
            ref,
            () => ({
                scrollToIndex: (index, options) => {
                    virtualizer.scrollToIndex(index, options)
                }
            }),
            [virtualizer]
        )

        useLayoutEffect(() => {
            if (containerRef.current) {
                setScrollMargin(getOffsetTop(containerRef.current))
            }

            const navbar = document.getElementById('navigation-bar')
            if (navbar) {
                setScrollPaddingStart(navbar.getBoundingClientRect().height)
            }
        }, [])

        useEffect(() => {
            const ro = new ResizeObserver(() => {
                if (containerRef.current) {
                    setScrollMargin(getOffsetTop(containerRef.current))
                }

                const navbar = document.getElementById('navigation-bar')
                if (navbar) {
                    setScrollPaddingStart(navbar.getBoundingClientRect().height)
                }
            })

            ro.observe(document.body)
            return () => ro.disconnect()
        }, [])

        return (
            <div
                ref={containerRef}
                className='vlist relative'>
                <div
                    style={{
                        height: `${virtualizer.getTotalSize()}px`,
                        width: '100%'
                    }}>
                    {items.map((el) => (
                        <div
                            data-index={el.index}
                            key={el.key}
                            ref={virtualizer.measureElement}
                            style={
                                {
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    transform: `translateY(${el.start - virtualizer.options.scrollMargin}px)`
                                } as React.CSSProperties
                            }>
                            {renderItem(el)}
                        </div>
                    ))}
                </div>
            </div>
        )
    }
)

type VListContainerCoreProps = Omit<VListContainerProps, 'mode'> & {
    footer?: React.ReactNode
}

export const VListContainerCore = forwardRef<VListRef, VListContainerCoreProps>(
    ({ overscan = 5, renderItem, footer, containerClassName, ...other }, ref) => {
        const parentRef = useRef<HTMLDivElement | null>(null)

        const virtualizer = useVirtualizer({
            overscan,
            ...other,
            getScrollElement: () => parentRef.current
        })
        const items = virtualizer.getVirtualItems()

        useImperativeHandle(
            ref,
            () => ({
                scrollToIndex: (index, options) => {
                    virtualizer.scrollToIndex(index, options)
                }
            }),
            [virtualizer]
        )

        return (
            <div
                className={cn('h-auto max-h-[inherit] overflow-auto', containerClassName)}
                ref={parentRef}>
                <div
                    style={{
                        height: `${virtualizer.getTotalSize()}px`,
                        width: '100%',
                        position: 'relative'
                    }}>
                    {items.map((el) => (
                        <div
                            data-index={el.index}
                            key={el.key}
                            ref={virtualizer.measureElement}
                            style={
                                {
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    transform: `translateY(${el.start - virtualizer.options.scrollMargin}px)`
                                } as React.CSSProperties
                            }>
                            {renderItem(el)}
                        </div>
                    ))}
                </div>

                {footer}
            </div>
        )
    }
)

const VList = forwardRef<VListRef, VListProps>((props, ref) => {
    if (props.mode === 'container') {
        const { mode: _, ...other } = props
        return (
            <VListContainerCore
                ref={ref}
                {...other}
            />
        )
    }

    const { mode: _, ...other } = props
    return (
        <VListWindowCore
            ref={ref}
            {...other}
        />
    )
})

const InfiniteVList = forwardRef<VListRef, InfiniteVListProps>((props, ref) => {
    const {
        onScrollEnd,
        hasNextPage,
        isError,
        isLoading,
        isSuccess,
        error,
        showEmptyMessage = true,
        isEmptyMessageContainered,
        showSkeleton = true,
        Skeleton,
        ...other
    } = props

    const stopObserver = !hasNextPage || isError
    const ioRef = useIntersectionObserver({ onScrollEnd, stopObserver })

    if (other.count === 0 && isSuccess && showEmptyMessage && !isLoading) {
        return (
            <MessageContainer isContainered={isEmptyMessageContainered}>
                {EMPTY_MESSAGE}
            </MessageContainer>
        )
    }

    if (other.count === 0 && isError) {
        return <ErrorMessage error={error} />
    }

    if (other.count === 0 && showSkeleton && Skeleton) {
        return Skeleton
    }

    if (other.mode === 'container') {
        const { mode: _, ...containerProps } = other
        return (
            <InfiniteVListContainer
                ref={ref}
                onScrollEnd={onScrollEnd}
                stopObserver={stopObserver}
                {...containerProps}
            />
        )
    }

    return (
        <>
            <VListWindowCore
                ref={ref}
                {...other}
            />
            {!stopObserver && (
                <div
                    ref={ioRef}
                    className='mb-4 flex items-center justify-center py-4'>
                    <LoadingDots />
                </div>
            )}
        </>
    )
})

type InfiniteVListContainerInternalProps = Omit<VListContainerProps, 'mode'> & {
    onScrollEnd: () => void
    stopObserver: boolean
}

const InfiniteVListContainer = forwardRef<VListRef, InfiniteVListContainerInternalProps>(
    ({ onScrollEnd, stopObserver, ...props }, ref) => {
        const ioRef = useIntersectionObserver({
            onScrollEnd,
            stopObserver
        })

        return (
            <VListContainerCore
                ref={ref}
                {...props}
                footer={
                    !stopObserver ? (
                        <div
                            ref={ioRef}
                            className='mb-4 flex items-center justify-center py-4'>
                            <LoadingDots />
                        </div>
                    ) : null
                }
            />
        )
    }
)

function getOffsetTop(element: HTMLElement | null): number {
    return element ? element.offsetTop + getOffsetTop(element.offsetParent as HTMLElement) : 0
}

VList.displayName = 'VList'
VListWindowCore.displayName = 'VListWindowCore'
VListContainerCore.displayName = 'VListContainerCore'

InfiniteVList.displayName = 'InfiniteVList'
InfiniteVListContainer.displayName = 'InfiniteVListContainer'

export type { VirtualItem } from '@tanstack/react-virtual'
export { InfiniteVList, VList }
export type { InfiniteVListProps, VListContainerProps, VListProps, VListRef as VListWindowRef }
