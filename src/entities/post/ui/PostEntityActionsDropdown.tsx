'use client'

import { ReactNode, useState } from 'react'
import { DotsAppIcon } from '@/shared/icons'
import { Button } from '@/shared/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/shared/ui/dropdown-menu'

type Props = {
    actions: (params: { onClose: () => void }) => ReactNode
}

export const PostEntityActionsDropdown = ({ actions }: Props) => {
    const [isOpen, setIsOpen] = useState(false)
    const onClose = () => setIsOpen(false)

    return (
        <DropdownMenu
            open={isOpen}
            onOpenChange={() => setIsOpen((prev) => !prev)}>
            <DropdownMenuTrigger asChild>
                <Button
                    rounedness='full'
                    variant='ghost'
                    size='icon-md'>
                    <DotsAppIcon />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align='end'
                className='min-w-44'>
                {actions({ onClose })}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
