import { textStyles } from '@/shared/ui/text'
import { cn } from '@/shared/utils/common.utils'
import { getCompactTextLength } from '@/shared/utils/string.utils'

export const Quote = ({ data, className }: { data: { text: string }[]; className?: string }) => {
    return (
        <QuoteContainer className={className}>
            {data.map(({ text }, index) => (
                <QuoteItem
                    key={index}
                    text={text}
                    index={index}
                    className={getQuoteStyle(index, text)}
                />
            ))}
        </QuoteContainer>
    )
}

const QuoteItem = ({
    index,
    text,
    className
}: {
    index: number
    className: string
    text: string
}) => {
    if (index === 0) {
        return <blockquote className={className}>{text}</blockquote>
    }

    return <p className={className}>{text}</p>
}

export const QuoteContainer = ({
    children,
    className
}: {
    children: React.ReactNode
    className?: string
}) => (
    <div
        className={cn(
            'grid grid-cols-[4px,minmax(0,1fr)] items-center gap-4 break-words',
            className
        )}>
        <div className='h-full w-full rounded-full bg-foreground' />
        <div className='flex flex-col gap-1'>{children}</div>
    </div>
)

export const getQuoteStyle = (index: number, text: string): string => {
    let style: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span'
    let additional = ' font-medium'
    if (index !== 0) {
        style = 'p'
        additional = ' text-muted-foreground'
    } else {
        const size = getCompactTextLength(text)
        if (size <= 50) {
            style = 'h3'
        } else if (size <= 150) {
            style = 'h4'
        } else {
            style = 'p'
        }
    }
    return textStyles({ as: style }) + additional
}
