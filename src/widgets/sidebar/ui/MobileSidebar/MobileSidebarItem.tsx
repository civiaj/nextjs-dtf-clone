import Link from 'next/link'
import { cn } from '@/shared/utils/common.utils'
import { TSidebarItem } from '../../types'

export const MobileSidebarItem = ({
    href,
    Icon,
    isActive
}: Omit<TSidebarItem, 'match'> & { isActive: boolean }) => {
    return (
        <section className='relative flex h-full flex-1 items-center justify-center'>
            <div
                className={cn('flex h-9 items-center gap-3 hover:bg-card', {
                    ['bg-card']: isActive
                })}>
                <Icon
                    size={20}
                    className={cn('shrink-0', { ['text-active']: isActive })}
                />
            </div>
            <Link
                href={href}
                className='absolute inset-0 outline-none focus-visible:ring-2 focus-visible:ring-active'
            />
        </section>
    )
}
