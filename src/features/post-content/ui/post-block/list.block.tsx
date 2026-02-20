import parse from 'html-react-parser'
import { Text } from '@/shared/ui/text'
import { cn } from '@/shared/utils/common.utils'
import { TBlockDataMap } from '../../types'

export const ListBlock = ({ data }: TBlockDataMap['list']) => {
    const { items, style } = data

    const ListTag = (style === 'unordered' ? 'ul' : 'ol') as keyof React.JSX.IntrinsicElements

    return (
        <ListTag
            className={cn('flex list-none flex-col gap-1 pl-4', {
                ['[counter-reset:list-counter]']: style === 'ordered'
            })}>
            {items.map((item, index) => (
                <li
                    key={index}
                    className={cn('grid grid-cols-[min-content,minmax(0,1fr)] gap-2', {
                        [`before:content-['•']`]: style === 'unordered',
                        [`before:content-[counter(list-counter)] before:[counter-increment:list-counter]`]:
                            style === 'ordered'
                    })}>
                    <Text>{parse(item.content)}</Text>
                </li>
            ))}
        </ListTag>
    )
}
