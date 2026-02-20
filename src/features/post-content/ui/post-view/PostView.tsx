import { memo } from 'react'
import Link from 'next/link'
import { EditorBlocks } from '@/entities/editor'
import { ContainerPadding } from '@/shared/ui/box'
import { Button } from '@/shared/ui/button'
import { PreviewContainer } from '@/shared/ui/MediaPreview'
import { PostViewBlockRenderer } from './PostViewBlockRenderer'
import { PostViewLinkWrapper } from './PostViewLinkWrapper'
import { TPostViewProps } from '../../types'
import './_.css'

export const PostView = memo(({ blocks, view, href }: TPostViewProps) => {
    const viewBlocks = view === 'full' ? blocks : getCoverBlocks(blocks)
    const isMore = view === 'cover' && viewBlocks.length < blocks.length && href

    return (
        <PostViewLinkWrapper
            view={view}
            href={href}>
            <ContainerPadding
                smallMargin
                className='renderer gap-0 whitespace-normal break-words'>
                <PreviewContainer>
                    {viewBlocks.map((block, index) => (
                        <PostViewBlockRenderer
                            key={index}
                            block={block}
                            view={view}
                        />
                    ))}
                </PreviewContainer>
                {isMore && (
                    <Link
                        href={href}
                        className='relative z-[1]'>
                        <Button
                            variant={'clean-active'}
                            padding={'tight'}
                            size={'base'}>
                            Читать далее
                        </Button>
                    </Link>
                )}
            </ContainerPadding>
        </PostViewLinkWrapper>
    )
})

PostView.displayName = 'PostView'

const getCoverBlocks = (blocks: EditorBlocks) => {
    if (!blocks.length) return []

    const result: EditorBlocks = []
    let hasTitle = false

    if (blocks[0]?.type === 'heading') {
        result.push(blocks[0])
        hasTitle = true
    }

    const coverBlocks = blocks.filter((block) => block.data.isCover)
    result.push(...coverBlocks)

    if (result.length === 0) result.push(blocks[0])
    if (hasTitle && result.length === 1 && blocks.length > 1) result.push(blocks[1])

    return result
}
