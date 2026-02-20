import { usePathname } from 'next/navigation'
import { MobileSidebarItem } from './MobileSidebarItem'
import { useSidebarItems } from '../../model/hooks/useSidebarItems'

export const MobileSidebar = () => {
    const items = useSidebarItems()
    const pathname = usePathname()

    return (
        <aside className='sidebar-mobile'>
            <div className='flex h-full w-full'>
                {items.map(({ Icon, label, href, match }) => (
                    <MobileSidebarItem
                        isActive={match(pathname)}
                        Icon={Icon}
                        label={label}
                        href={href}
                        key={href}
                    />
                ))}
            </div>
        </aside>
    )
}
