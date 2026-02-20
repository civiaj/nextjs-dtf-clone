import { EDITOR_TOOL_NAME } from '../../model/config'
import { EditorBlockTool } from '../../model/types'

export default class BlockMeta {
    private getElement: () => HTMLElement
    private getTool: () => EditorBlockTool

    constructor({
        getTool,
        getElement
    }: {
        getTool: () => EditorBlockTool
        getElement: () => HTMLElement
    }) {
        this.getElement = getElement
        this.getTool = getTool
    }

    get isEmpty() {
        return (
            this.getTool().block.name === EDITOR_TOOL_NAME.PARAGRAPH &&
            this.getElement().textContent === ''
        )
    }

    get isOrdered() {
        const tool = this.getTool()
        return 'listStyle' in tool && tool.listStyle === 'ordered'
    }

    get isUnordered() {
        const tool = this.getTool()
        return 'listStyle' in tool && tool.listStyle === 'unordered'
    }

    get isTitle() {
        return this.getTool().block?.holder?.querySelector('h1') !== null
    }
}
