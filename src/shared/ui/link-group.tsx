'use client'

import { memo, useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/shared/utils/common.utils'

export type THosrizontalLink = { label: string; href: string; isDefault?: boolean }

export const HorizontalLinkGroup = memo(
    ({
        options,
        localStorageKey = 'feed'
    }: {
        options: THosrizontalLink[]
        localStorageKey?: string
    }) => {
        const containerRef = useRef<HTMLDivElement | null>(null)
        const indicatorRef = useRef<HTMLDivElement | null>(null)
        const [activeIndex, setActiveIndex] = useState<number | null>(null)
        const linksRef = useRef<HTMLAnchorElement[]>([])
        const pathname = usePathname()
        const router = useRouter()

        const updateIndicator = useCallback(({ left, width }: { left: number; width: number }) => {
            const indicator = indicatorRef.current
            if (!indicator) return

            indicatorRef.current!.style.left = left + 'px'
            indicatorRef.current!.style.width = width + 'px'
        }, [])

        useEffect(() => {
            if (typeof window === 'undefined') return

            const oldValue = localStorage.getItem(localStorageKey) ?? null
            const oldIndex = options.findIndex((option) => option.href === oldValue)
            const oldLink = linksRef.current[oldIndex]

            let activeIndex = options.findIndex((option) => pathname === option.href)

            // if nested
            if (activeIndex === -1) {
                activeIndex = options.findIndex((option) => pathname.includes(option.href))
            }

            if (activeIndex === -1) {
                activeIndex = options.findIndex((option) => option.isDefault)
            }

            const activeValue = options[activeIndex]?.href
            const activeLink = linksRef.current[activeIndex]

            if (oldLink) {
                updateIndicator({ left: oldLink.offsetLeft, width: oldLink.offsetWidth })
            }

            if (activeLink) {
                requestAnimationFrame(() => {
                    updateIndicator({ left: activeLink.offsetLeft, width: activeLink.offsetWidth })
                })
            }

            setActiveIndex(activeIndex)
            localStorage.setItem(localStorageKey, activeValue)

            const container = containerRef.current

            if (!container) return

            const ro = new ResizeObserver(() => {
                if (oldLink) {
                    updateIndicator({ left: oldLink.offsetLeft, width: oldLink.offsetWidth })
                }
            })

            ro.observe(container)

            return () => {
                ro.disconnect()
            }
        }, [options, localStorageKey, pathname, updateIndicator])

        return (
            <div
                ref={containerRef}
                className='relative'>
                <div className='relative flex gap-3 md:gap-4'>
                    {options.map(({ label, href }, index) => (
                        <Link
                            ref={(node) => {
                                if (node) {
                                    linksRef.current[index] = node
                                }
                            }}
                            onClick={() => router.push(href, { scroll: false })}
                            className={cn(
                                'block min-w-0 truncate py-3 text-sm font-medium text-muted-foreground transition-all hover:text-primary active:text-muted-foreground md:py-4 md:text-base',
                                { ['text-primary']: activeIndex === index }
                            )}
                            href={href}
                            key={index}>
                            {label}
                        </Link>
                    ))}
                </div>
                <div
                    ref={indicatorRef}
                    className={cn(
                        'pointer-events-none absolute bottom-0 block h-[3px] bg-active transition-all'
                    )}
                />
            </div>
        )
    }
)

HorizontalLinkGroup.displayName = 'HorizontalLinkGroup'
