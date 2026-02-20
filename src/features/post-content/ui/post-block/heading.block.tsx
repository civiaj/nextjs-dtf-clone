import { Text, textStyles } from '@/shared/ui/text'
import { TBlockDataMap } from '../../types'

export const HeadingBlock = ({ data, view }: TBlockDataMap['heading']) => {
    const { text, level } = data

    if (view === 'cover') {
        return <div className={textStyles({ as: `h${level}` })}>{text}</div>
    }

    return <Text as={`h${level}`}>{text}</Text>
}
