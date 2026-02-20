import ReactPlayer from 'react-player'
import { cn } from '@/shared/utils/common.utils'
import { TBlockDataMap, TPostViewProps } from '../../types'
import { CodeBlock } from '../post-block/code.block'
import { HeadingBlock } from '../post-block/heading.block'
import { LinkBlock } from '../post-block/link.block'
import { ListBlock } from '../post-block/list.block'
import { MediaBlock } from '../post-block/media.block'
import { ParagraphBlock } from '../post-block/paragraph.block'
import { QuoteBlock } from '../post-block/quote.,block'
import { SeparatorBlock } from '../post-block/separator.block'
import { PostBlockSpoiler } from '../post-block-spoiler/PostBlockSpoiler'

export const PostViewBlockRenderer = ({
    block,
    view
}: {
    view: TPostViewProps['view']
    block: TPostViewProps['blocks'][number]
}) => {
    let Block: React.JSX.Element | null = null

    switch (block.type) {
        case 'heading': {
            Block = (
                <HeadingBlock
                    data={block.data as TBlockDataMap['heading']['data']}
                    view={view}
                />
            )
            break
        }
        case 'paragraph': {
            Block = (
                <ParagraphBlock
                    data={block.data}
                    view={view}
                />
            )
            break
        }
        case 'separator': {
            Block = (
                <SeparatorBlock
                    data={block.data}
                    view={view}
                />
            )
            break
        }
        case 'list': {
            Block = (
                <ListBlock
                    data={block.data}
                    view={view}
                />
            )
            break
        }
        case 'code': {
            Block = (
                <CodeBlock
                    data={block.data}
                    view={view}
                />
            )
            break
        }
        case 'link': {
            Block = (
                <LinkBlock
                    data={block.data}
                    view={view}
                />
            )
            break
        }
        case 'quote': {
            Block = (
                <QuoteBlock
                    data={block.data}
                    view={view}
                />
            )
            break
        }
        case 'media': {
            Block = (
                <MediaBlock
                    data={block.data}
                    view={view}
                />
            )
            break
        }
        default: {
            console.warn('Unknown block type:', (block as TPostViewProps['blocks'][number]).type)
        }
    }

    const isMediaContent =
        block.type === 'media' || (block.type === 'link' && ReactPlayer.canPlay(block.data.url))

    if (block.data.isHidden) {
        Block = (
            <PostBlockSpoiler type={isMediaContent ? 'dark' : 'regular'}>{Block}</PostBlockSpoiler>
        )
    }

    if (!Block) return null

    return (
        <figure
            data-block={block.type}
            className={cn('relative mb-2', {
                ['my-4']: block.type === 'media',
                ['z-10']: isMediaContent
            })}>
            {Block}
        </figure>
    )
}
