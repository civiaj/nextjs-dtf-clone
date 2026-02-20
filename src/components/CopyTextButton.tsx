'use client'

import { useCopyToClipboard } from '@/shared/hooks'
import { CheckAppIcon, CopyAppIcon } from '@/shared/icons'
import { Button } from '@/shared/ui/button'
import { cn } from '@/shared/utils/common.utils'

interface CopyTextButtonProps {
    text: string
    className?: string
}

export const CopyTextButton = ({ text, className }: CopyTextButtonProps) => {
    const { copy, isCopied } = useCopyToClipboard()

    const handleCopy = async () => {
        await copy(text, 1000)
    }

    return (
        <Button
            onClick={handleCopy}
            className={cn('relative transition-all', className)}
            variant={'ghost'}
            size={'base'}
            disabled={!text}
            aria-label={isCopied ? 'Скопировано' : 'Копировать текст'}
            title='Копировать в буфер обмена'>
            <div className='relative h-full w-full'>
                <CopyAppIcon
                    size={16}
                    className={cn(
                        'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
                        'transition-all duration-200',
                        isCopied ? 'scale-50 opacity-0' : 'scale-100 opacity-100'
                    )}
                />
                <CheckAppIcon
                    size={16}
                    className={cn(
                        'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
                        'transition-all duration-200',
                        isCopied ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
                    )}
                />
            </div>

            <span className='sr-only'>{isCopied ? 'Текст скопирован' : 'Копировать текст'}</span>
        </Button>
    )
}
