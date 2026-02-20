import parse from 'html-react-parser'
import { Text } from '@/shared/ui/text'
import { cn } from '@/shared/utils/common.utils'
import { TBlockDataMap } from '../../types'

export const ParagraphBlock = ({ data, view }: TBlockDataMap['paragraph']) => {
    return (
        <Text
            className={cn({ ['line-clamp-5']: view === 'cover' })}
            as='p'>
            {parse(data.text)}
        </Text>
    )
}
