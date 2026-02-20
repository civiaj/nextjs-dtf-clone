import {
    CodeData,
    HeadingData,
    LinkData,
    ListData,
    MediaData,
    QuoteData,
    ParagraphData,
    SeparatorData,
    EditorBlocks
} from '@/entities/editor'
import { TPostEntityRenderView } from '@/entities/post'

type TCodeBlockData = { data: CodeData; view: TPostEntityRenderView }
type THeadingBlockData = { data: HeadingData; view: TPostEntityRenderView }
type TParagraphBlockData = { data: ParagraphData; view: TPostEntityRenderView }
type TLinkBlockData = { data: LinkData; view: TPostEntityRenderView }
type TListBlockData = { data: ListData; view: TPostEntityRenderView }
type TMediaBlockData = { data: MediaData; view: TPostEntityRenderView }
type TQuoteBlockData = { data: QuoteData; view: TPostEntityRenderView }
type TSeparatorBlockData = { data: SeparatorData; view: TPostEntityRenderView }

export type TBlockDataMap = {
    code: TCodeBlockData
    heading: THeadingBlockData
    paragraph: TParagraphBlockData
    link: TLinkBlockData
    list: TListBlockData
    media: TMediaBlockData
    quote: TQuoteBlockData
    separator: TSeparatorBlockData
}

export type TPostViewProps = {
    view: TPostEntityRenderView
    blocks: EditorBlocks
    href?: string
}
