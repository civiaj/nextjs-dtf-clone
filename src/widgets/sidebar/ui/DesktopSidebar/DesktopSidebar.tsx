import { usePathname } from 'next/navigation'
import { useAppSelector } from '@/lib/store'
import { ScrollArea } from '@/shared/ui/scroll-area'
import { cn } from '@/shared/utils/common.utils'
import { DesktopSidebarItem } from './DesktopSidebarItem'
import { useSidebarItems } from '../../model/hooks/useSidebarItems'

export const DesktopSidebar = () => {
    const sidebarIsOpen = useAppSelector((state) => state.ui.sidebarIsOpen)
    const items = useSidebarItems()
    const pathname = usePathname()

    return (
        <aside className={cn('sidebar-desktop', { ['!grid-cols-[220px]']: sidebarIsOpen })}>
            <ScrollArea
                type='always'
                className='h-full'>
                <div className='mr-2 flex max-w-full shrink-0 flex-col items-start gap-2 px-3'>
                    {items.map(({ Icon, label, href, match }) => (
                        <DesktopSidebarItem
                            isActive={match(pathname)}
                            Icon={Icon}
                            label={label}
                            href={href}
                            key={href}
                        />
                    ))}
                </div>
            </ScrollArea>
        </aside>
    )
}
