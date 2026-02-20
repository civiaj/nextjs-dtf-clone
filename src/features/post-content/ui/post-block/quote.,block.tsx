import parse from 'html-react-parser'
import { Text, textStyles } from '@/shared/ui/text'
import { cn } from '@/shared/utils/common.utils'
import { TBlockDataMap } from '../../types'

export const QuoteBlock = ({ data }: TBlockDataMap['quote']) => {
    const { caption, text } = data
    return (
        <blockquote className='quote-wrapper'>
            <Text
                className={cn(
                    'quote-text',
                    {
                        [textStyles({ as: 'p' })]: text.length > 100,
                        [textStyles({ as: 'h3' })]: text.length > 50 && text.length <= 100,
                        [textStyles({ as: 'h2' })]: text.length <= 50 && text.length > 0
                    },
                    'font-medium'
                )}>
                {parse(text)}
            </Text>
            {caption && <cite className='quote-caption'>{parse(caption)}</cite>}
        </blockquote>
    )
}
