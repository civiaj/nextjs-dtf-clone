import { ToolConstructable, ToolSettings } from '@editorjs/editorjs'
import { EditorBlockNames } from '@/entities/editor'
import { InlineTools } from './types'
import Code from '../tools/code.tool'
import { ExtendBlock } from '../tools/extend/extend'
import { maxCharsBehavior, navigationHandler, slashMenuBehavior } from '../tools/extend/handlers'
import Heading from '../tools/heading.tool'
import { Bold } from '../tools/inline-tools/bold'
import { Italic } from '../tools/inline-tools/italic'
import LinkInlineTool from '../tools/inline-tools/link'
import Link from '../tools/link.tool'
import List from '../tools/list'
import Media from '../tools/media'
import Paragraph from '../tools/paragraph.tool'
import Quote from '../tools/quote.tool'
import Separator from '../tools/separator.tool'

export const EDITOR_TOOLS: Record<
    EditorBlockNames & InlineTools,
    ToolConstructable | ToolSettings
> = {
    paragraph: {
        class: ExtendBlock(Paragraph, [slashMenuBehavior, navigationHandler]),
        inlineToolbar: ['Bold', 'Italic', 'Link'],
        config: {
            preserveBlank: false,
            placeholder: `Нажмите '/' чтобы выбрать инструмент`
        }
    },
    quote: {
        class: ExtendBlock(Quote, [slashMenuBehavior, navigationHandler]),
        inlineToolbar: ['Bold', 'Italic', 'Link']
    },
    separator: {
        class: ExtendBlock(Separator, [slashMenuBehavior, navigationHandler]),
        inlineToolbar: false
    },
    link: {
        class: ExtendBlock(Link, [slashMenuBehavior, navigationHandler]),
        inlineToolbar: false
    },
    list: {
        class: ExtendBlock(List, [slashMenuBehavior, navigationHandler]),
        inlineToolbar: ['Bold', 'Italic', 'Link'],
        config: { maxLevel: 1 }
    },
    code: {
        class: ExtendBlock(Code, [slashMenuBehavior, navigationHandler]),
        inlineToolbar: false
    },

    media: {
        class: ExtendBlock(Media, [slashMenuBehavior, navigationHandler]),
        inlineToolbar: false
    },
    heading: {
        class: ExtendBlock(Heading, [
            maxCharsBehavior({
                limit: 255,
                dangerZone: 20,
                condition(tool) {
                    return tool.block.holder.querySelector('h1') !== null
                }
            }),
            slashMenuBehavior,
            navigationHandler
        ]),
        inlineToolbar: false,
        config: {
            levels: [1, 2],
            defaultLevel: 2
        }
    },
    Bold: Bold,
    Italic: Italic,
    Link: LinkInlineTool
}

export const EDITOR_TOOL_NAME: Record<string, EditorBlockNames> = {
    PARAGRAPH: 'paragraph',
    QUOTE: 'quote',
    SEPARATOR: 'separator',
    LINK: 'link',
    LIST: 'list',
    CODE: 'code',
    MEDIA: 'media',
    HEADING: 'heading'
}
