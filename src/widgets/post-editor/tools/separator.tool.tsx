import { API, BlockAPI } from '@editorjs/editorjs'
import { SeparatorToolData } from '@/entities/editor'
import { EditorBlockArgs, EditorBlockTool } from '../model/types'

interface SeparatorCSS {
    block: string
    wrapper: string
}

class Separator implements EditorBlockTool<SeparatorToolData> {
    static get isReadOnlySupported(): boolean {
        return true
    }

    static get contentless(): boolean {
        return true
    }

    static get pasteConfig() {
        return { tags: ['HR'] }
    }

    api: API
    block: BlockAPI
    element: HTMLDivElement
    data: object
    readOnly: boolean

    private css: SeparatorCSS

    constructor({ data, block, readOnly, api }: EditorBlockArgs<void>) {
        this.api = api
        this.block = block
        this.readOnly = readOnly

        this.css = {
            block: this.api.styles.block,
            wrapper: 'ce-separator'
        }

        this.data = this.normalize(data)
        this.element = this.getElement()
    }

    normalize(_data: unknown): object {
        return {}
    }

    getElement(): HTMLDivElement {
        const tag = document.createElement('div')
        tag.classList.add(this.css.block, this.css.wrapper)

        return tag
    }

    render(): HTMLDivElement {
        return this.element
    }

    save() {
        return {}
    }
}

export default Separator
