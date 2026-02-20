import Link from 'next/link'
import { cn } from '@/shared/utils/common.utils'
import { TSidebarItem } from '../../types'

export const DesktopSidebarItem = ({
    Icon,
    label,
    href,
    isActive
}: Omit<TSidebarItem, 'match'> & { isActive: boolean }) => {
    return (
        <section className='relative w-full'>
            <div
                className={cn('flex h-9 items-center gap-3 rounded-xl px-2 hover:bg-card', {
                    ['bg-card']: isActive
                })}>
                <Icon
                    size={20}
                    className={cn('shrink-0', { ['text-active']: isActive })}
                />
                {label}
                <Link
                    href={href}
                    className='absolute inset-0 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-active'
                />
            </div>
        </section>
    )
}
