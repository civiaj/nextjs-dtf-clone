'use client'

import { uiActions } from '@/entities/ui'
import { useAppDispatch } from '@/lib/store'
import { MenuAppIcon } from '@/shared/icons'
import { Button } from '@/shared/ui/button'

export const ToggleSidebarButton = () => {
    const dispatch = useAppDispatch()

    return (
        <Button
            variant={'ghost'}
            size={'icon-base'}
            className='hidden lg:flex'
            onClick={() => dispatch(uiActions.toggleSidebar())}>
            <MenuAppIcon size={24} />
        </Button>
    )
}
