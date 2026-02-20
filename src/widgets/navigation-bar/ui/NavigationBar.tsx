import { CreatePostButton } from '@/features/create-post-button'
import { ToggleSidebarButton } from '@/features/sidebar'
import { NavigaitonMenu } from './NavigationMenu'

export const NavigationBar = () => {
    return (
        <nav
            id='navigation-bar'
            className='sticky top-0 z-40 h-navbar w-full shrink-0 border-b bg-card/80 backdrop-blur-lg lg:border-b-0'>
            <div className='mx-auto flex h-full max-w-screen-xl items-center justify-between px-3'>
                <ToggleSidebarButton />
                <div className='ml-auto flex items-center gap-2'>
                    <CreatePostButton />
                    <NavigaitonMenu />
                </div>
            </div>
        </nav>
    )
}
