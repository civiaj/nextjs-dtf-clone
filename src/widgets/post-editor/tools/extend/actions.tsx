import { API, BlockAPI } from '@editorjs/editorjs'
import { EditorBlockNames } from '@/entities/editor/model/types'
import { EDITOR_TOOL_NAME } from '../../model/config'
import { EditorBlockTool } from '../../model/types'
import { ListDataStyle } from '../list/types/ListParams'

export default class BlockActions {
    api: API
    block: BlockAPI
    getTool: () => EditorBlockTool

    constructor({
        api,
        block,
        getTool
    }: {
        api: API
        block: BlockAPI
        getTool: () => EditorBlockTool
    }) {
        this.api = api
        this.block = block
        this.getTool = getTool
    }

    public toHeading() {
        const text = this.block.holder.querySelector('[contenteditable]')?.textContent
        const index = this.api.blocks.getBlockIndex(this.block.id)
        this.api.blocks.insert(
            EDITOR_TOOL_NAME.HEADING,
            { text },
            {},
            index,
            false,
            true,
            this.block.id
        )
    }

    public toParagraph() {
        const text = this.block.holder.querySelector('[contenteditable]')?.textContent
        const index = this.api.blocks.getBlockIndex(this.block.id)
        this.api.blocks.insert(
            EDITOR_TOOL_NAME.PARAGRAPH,
            { text },
            {},
            index,
            false,
            true,
            this.block.id
        )
    }

    public create(toolName: EditorBlockNames, needToFocus: boolean = false) {
        const index = this.api.blocks.getBlockIndex(this.block.id)
        const replace = needToFocus ? false : true

        this.api.blocks.insert(toolName, {}, {}, index, needToFocus, replace, this.block.id)

        if (!replace) {
            this.api.blocks.delete(index + 1)
        }
    }

    public remove() {
        const index = this.api.blocks.getBlockIndex(this.block.id)
        this.api.blocks.delete(index)
    }

    public async move(dir: 1 | -1) {
        const currentIndex = this.api.blocks.getBlockIndex(this.block.id)
        const nextIndex = currentIndex + dir
        this.api.blocks.move(nextIndex, currentIndex)
    }

    public setListStyle(style: ListDataStyle) {
        const tool = this.getTool()
        if (!('listStyle' in tool)) return

        tool.listStyle = style
    }

    public focusNext(index?: number) {
        const count = this.api.blocks.getBlocksCount()
        let start = index ?? this.api.blocks.getBlockIndex(this.block.id)
        let moved = false

        while (++start < count) {
            const block = this.api.blocks.getBlockByIndex(start)

            if (this.isFocusable(block)) {
                this.api.caret.setToBlock(start, 'start')
                moved = true
                break
            }
        }

        if (!moved) {
            this.api.blocks.insert(EDITOR_TOOL_NAME.PARAGRAPH, {}, {}, count)
            this.api.caret.setToBlock(count, 'start')
        }
    }

    public focusPrev(index?: number) {
        let start = index ?? this.api.blocks.getBlockIndex(this.block.id)

        while (--start >= 0) {
            const block = this.api.blocks.getBlockByIndex(start)

            if (this.isFocusable(block)) {
                this.api.caret.setToBlock(start, 'end')
                break
            }
        }
    }

    private isFocusable(block: BlockAPI | undefined) {
        if (!block) return false

        return (
            block.holder.querySelector('[contenteditable], input[type="text"], textarea') !== null
        )
    }
}
