'use client'

import { InfoAppIcon } from '@/shared/icons'
import { Button } from '@/shared/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/shared/ui/dropdown-menu'
import { Text } from '@/shared/ui/text'
import { commentHintItems } from './commentHintItems'
import { TiptapHintProps } from './types'

export const TiptapHint = ({
    triggerTitle = 'Show editor hints',
    triggerAriaLabel = 'Show editor hints'
}: TiptapHintProps) => {
    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <Button
                    size='icon-base'
                    variant='ghost'
                    title={triggerTitle}
                    aria-label={triggerAriaLabel}>
                    <InfoAppIcon size={18} />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align='start'
                className='max-w-72 p-4'>
                <ol className='mt-2 space-y-2'>
                    {commentHintItems.map((hint, index) => (
                        <li
                            key={`${hint.symbol}-${index}`}
                            className='flex items-start gap-2'>
                            <div className='inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-active/10 text-xl font-medium text-active'>
                                {hint.symbol}
                            </div>
                            <div>
                                <Text as='h4'>{hint.title}</Text>
                                <Text
                                    as='p'
                                    className='text-sm leading-4 text-muted-foreground sm:text-sm'>
                                    {hint.description}
                                </Text>
                            </div>
                        </li>
                    ))}
                </ol>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
