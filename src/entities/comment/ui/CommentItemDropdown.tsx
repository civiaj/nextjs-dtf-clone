import { useState } from 'react'
import { DotsAppIcon } from '@/shared/icons'
import { Button } from '@/shared/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/shared/ui/dropdown-menu'

export type CommentItemDropdownProps = {
    actions: (params: { onClose: () => void }) => React.ReactNode
}

export const CommentItemDropdown = ({ actions }: CommentItemDropdownProps) => {
    const [isOpen, setIsOpen] = useState(false)
    const onClose = () => setIsOpen(false)

    return (
        <DropdownMenu
            modal={false}
            open={isOpen}
            onOpenChange={() => setIsOpen((p) => !p)}>
            <DropdownMenuTrigger asChild>
                <Button
                    className='ml-auto'
                    rounedness={'full'}
                    variant={'ghost'}
                    size={'icon-sm'}>
                    <DotsAppIcon size={16} />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align='end'
                className='min-w-56'>
                {actions({ onClose })}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
