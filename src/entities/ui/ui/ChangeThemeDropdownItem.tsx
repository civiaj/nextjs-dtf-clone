import React from 'react'
import { useAppDispatch } from '@/lib/store'
import { MoonAppIcon, SunAppIcon } from '@/shared/icons'
import {
    DropdownMenuItem,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger
} from '@/shared/ui/dropdown-menu'
import { Text } from '@/shared/ui/text'
import { useAppTheme } from '../hooks/useTheme'
import { uiActions } from '../model/slice'
import { APP_THEMES_OPTIONS, AppTheme } from '../model/types'

export const ChangeThemeDropdownItem = () => {
    const theme = useAppTheme()
    const dispatch = useAppDispatch()
    const handleSelect = (value: AppTheme) => dispatch(uiActions.setTheme(value))

    return (
        <DropdownMenuSub>
            <DropdownMenuSubTrigger>
                {theme === 'dark' && <MoonAppIcon size={20} />}
                {theme === 'light' && <SunAppIcon size={20} />}
                <Text as='p'>Тема</Text>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
                <DropdownMenuSubContent>
                    {APP_THEMES_OPTIONS.map(({ label, value }, index) => (
                        <React.Fragment key={index}>
                            {value === 'system' && <DropdownMenuSeparator />}
                            <DropdownMenuItem
                                variant={value === theme ? 'active' : undefined}
                                onSelect={() => handleSelect(value)}>
                                {label}
                            </DropdownMenuItem>
                        </React.Fragment>
                    ))}
                </DropdownMenuSubContent>
            </DropdownMenuPortal>
        </DropdownMenuSub>
    )
}
