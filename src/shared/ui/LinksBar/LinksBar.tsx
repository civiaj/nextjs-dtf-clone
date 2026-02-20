'use client'

import { memo, useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/shared/utils/common.utils'

export const LinksBar = memo(
    ({ items, className, linkItemClassName }: TLinksBarProps) => {
        const pathname = usePathname()
        const containerRef = useRef<HTMLDivElement>(null)
        const rafRef = useRef<number>(null)
        const left = useMotionValue(0)
        const width = useMotionValue(0)
        const smoothLeft = useSpring(left, { stiffness: 300, damping: 30 })
        const smoothWidth = useSpring(width, { stiffness: 300, damping: 30 })

        const activeItem = findActiveItem(items, pathname)

        useEffect(() => {
            const container = containerRef.current
            const el = container?.querySelector(`[data-active="true"]`)

            if (!container || !el) return

            const update = () => {
                if (rafRef.current) {
                    cancelAnimationFrame(rafRef.current)
                }

                rafRef.current = requestAnimationFrame(() => {
                    const containerRect = container.getBoundingClientRect()
                    const elementRect = el.getBoundingClientRect()
                    left.set(elementRect.left - containerRect.left)
                    width.set(elementRect.width)
                })
            }

            const ro = new ResizeObserver(update)
            ro.observe(container)

            update()

            return () => {
                ro.disconnect()
                if (rafRef.current) {
                    cancelAnimationFrame(rafRef.current)
                }
            }
        }, [pathname, left, width])

        return (
            <div
                ref={containerRef}
                className={cn('relative flex items-center gap-3 font-medium', className)}>
                {items.map(({ href, label }) => {
                    const isActive = activeItem?.href === href
                    return (
                        <Link
                            key={href}
                            href={href}
                            data-active={isActive}
                            className={cn(
                                'block min-w-0 truncate text-sm font-medium text-muted-foreground transition-all hover:text-primary active:text-muted-foreground sm:text-base',
                                { 'text-primary': isActive },
                                linkItemClassName
                            )}>
                            {label}
                        </Link>
                    )
                })}

                <motion.div
                    className='pointer-events-none absolute bottom-0 h-[3px] transform-gpu rounded-full bg-active will-change-transform'
                    style={{
                        width: smoothWidth,
                        left: smoothLeft
                    }}
                />
            </div>
        )
    },
    () => true
)

LinksBar.displayName = 'LinksBar'

export type TLinksBarItem = {
    label: string
    href: string
    isDefaultActive?: boolean
    match?: 'startsWith' | 'exact' | ((pathname: string) => boolean)
}

type TLinksBarProps = {
    items: TLinksBarItem[]
    className?: string
    linkItemClassName?: string
}

const findActiveItem = (items: TLinksBarItem[], pathname: string) => {
    for (const item of items) {
        if (typeof item.match === 'function' && item.match(pathname)) return item
        if (item.match === 'startsWith' && pathname.startsWith(item.href)) return item
        if (item.match === 'exact' && pathname === item.href) return item
    }
    return items.find((i) => i.isDefaultActive)
}
