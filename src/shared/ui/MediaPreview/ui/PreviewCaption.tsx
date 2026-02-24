import { useState } from 'react'
import { Text } from '@/shared/ui/text'
import { cn } from '@/shared/utils/common.utils'

export const PreviewCaption = ({
    caption,
    editable,
    onChange
}: {
    caption: string
    editable: boolean
    onChange: (value: string) => void
}) => {
    if (editable) {
        return (
            <CaptionContainer>
                <EditableCaption
                    caption={caption}
                    onChange={onChange}
                />
            </CaptionContainer>
        )
    }

    return (
        Boolean(caption) && (
            <CaptionContainer className='break-words p-4 hover:opacity-0'>
                <Text as='p'>{caption}</Text>
            </CaptionContainer>
        )
    )
}

const CaptionContainer = ({
    children,
    className
}: {
    children?: React.ReactNode
    className?: string
}) => {
    return (
        <div
            className={cn(
                'pointer-events-auto mx-auto max-w-2xl overflow-hidden border border-zinc-700 bg-zinc-800 text-white transition-opacity sm:rounded-xl',
                className
            )}>
            {children}
        </div>
    )
}

const EditableCaption = ({
    caption,
    onChange
}: {
    caption: string
    onChange: (value: string) => void
}) => {
    const [value, setValue] = useState(caption)
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value)
        onChange(e.target.value)
    }

    return (
        <input
            name='caption'
            placeholder='Введите описание...'
            className='w-full bg-transparent p-4 outline-none'
            value={value}
            onChange={handleInputChange}
        />
    )
}
