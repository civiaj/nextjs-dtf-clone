import { z } from 'zod'
import { codeSchema } from '@/shared/validation/editor/code.validation'
import { editorSchema, editorSchemaTransformed } from '@/shared/validation/editor/editor.validation'
import { headingSchema } from '@/shared/validation/editor/heading.validation'
import { linkSchema } from '@/shared/validation/editor/link.validation'
import { listSchema } from '@/shared/validation/editor/list.validation'
import { mediaSchema } from '@/shared/validation/editor/media.validation'
import { paragraphSchema } from '@/shared/validation/editor/paragraph.validation'
import { quoteSchema } from '@/shared/validation/editor/quote.validation'
import { separatorSchema } from '@/shared/validation/editor/separator.validation'

export type CommonToolData = {
    isHidden: boolean
    isCover: boolean
}

type ToolData<T extends { data: unknown }> = Omit<T['data'], keyof CommonToolData>

type CodeTool = z.infer<typeof codeSchema>
export type CodeToolData = ToolData<CodeTool>
export type CodeData = CodeTool['data']

type ParagraphTool = z.infer<typeof paragraphSchema>
export type ParagraphToolData = ToolData<ParagraphTool>
export type ParagraphData = ParagraphTool['data']

type HeadingTool = z.infer<typeof headingSchema>
export type HeadingToolData = ToolData<HeadingTool>
export type HeadingData = HeadingTool['data']

type MediaTool = z.infer<typeof mediaSchema>
export type MediaToolData = ToolData<MediaTool>
export type MediaData = MediaTool['data']

type ListTool = z.infer<typeof listSchema>
export type ListToolData = ToolData<ListTool>
export type ListData = ListTool['data']

type LinkTool = z.infer<typeof linkSchema>
export type LinkToolData = ToolData<LinkTool>
export type LinkData = LinkTool['data']

type QuoteTool = z.infer<typeof quoteSchema>
export type QuoteToolData = ToolData<QuoteTool>
export type QuoteData = QuoteTool['data']

type SeparatorTool = z.infer<typeof separatorSchema>
export type SeparatorToolData = ToolData<SeparatorTool>
export type SeparatorData = SeparatorTool['data']

export type EditorData = z.infer<typeof editorSchema>
export type EditorBlocks = z.infer<typeof editorSchemaTransformed>
export type EditorBlockNames = EditorBlocks[number]['type']
