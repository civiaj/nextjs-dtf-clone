import type { API, BlockAPI } from '@editorjs/editorjs'
import { OrderedListRenderer, UnorderedListRenderer } from './ListRenderer'
import ListTabulator from './ListTabulator'
import type { PasteEvent } from './types'
import type { ListConfig, ListData, ListDataStyle, ListItem } from './types/ListParams'
import type { ListRenderer } from './types/ListRenderer'
import { EditorBlockArgs, EditorBlockTool } from '../../model/types'

export default class List implements EditorBlockTool<ListData> {
    static get isReadOnlySupported(): boolean {
        return true
    }
    static get enableLineBreaks(): boolean {
        return true
    }
    static get pasteConfig() {
        return {
            tags: ['OL', 'UL', 'LI']
        }
    }

    get listStyle(): ListDataStyle {
        return this.data.style || this.defaultListStyle
    }

    set listStyle(style: ListDataStyle) {
        this.data.style = style
        this.changeTabulatorByStyle()
        const newListElement = this.list!.render()

        this.element.innerHTML = ''
        this.element.appendChild(newListElement)
    }

    api: API
    readOnly: boolean
    config: ListConfig | undefined
    defaultListStyle: ListDataStyle
    data: ListData
    block: BlockAPI
    list: ListTabulator<ListRenderer> | undefined
    element: HTMLElement

    constructor({ data, config, api, readOnly, block }: EditorBlockArgs<ListConfig>) {
        this.api = api
        this.readOnly = readOnly
        this.config = config
        this.block = block
        this.defaultListStyle = this.config?.defaultStyle || 'unordered'

        this.data = this.normalize(data)
        this.changeTabulatorByStyle()

        this.element = document.createElement('div')
        this.element.appendChild(this.list!.render())
    }

    normalize(data: unknown) {
        const defaultData = {
            meta: {},
            style: this.defaultListStyle,
            items: []
        }

        if (isListBlockData(data)) {
            return structuredClone(data)
        }

        return defaultData
    }

    render(): HTMLElement {
        return this.element
    }

    save(_element: HTMLElement): ListData {
        const data = this.list!.save()
        this.data = data
        return data
    }

    merge(data: ListData): void {
        this.list!.merge(data)
    }

    onPaste(event: PasteEvent): void {
        const { tagName: tag } = event.detail.data

        switch (tag) {
            case 'OL':
                this.listStyle = 'ordered'
                break
            case 'UL':
            case 'LI':
                this.listStyle = 'unordered'
        }

        this.list!.onPaste(event)
    }

    private changeTabulatorByStyle(): void {
        switch (this.listStyle) {
            case 'ordered':
                this.list = new ListTabulator<OrderedListRenderer>(
                    {
                        data: this.data,
                        readOnly: this.readOnly,
                        api: this.api,
                        config: this.config,
                        block: this.block
                    },
                    new OrderedListRenderer(this.readOnly, this.config)
                )

                break

            case 'unordered':
                this.list = new ListTabulator<UnorderedListRenderer>(
                    {
                        data: this.data,
                        readOnly: this.readOnly,
                        api: this.api,
                        config: this.config,
                        block: this.block
                    },
                    new UnorderedListRenderer(this.readOnly, this.config)
                )

                break
        }
    }
}

function isListBlockData(data: unknown): data is ListData {
    return (
        typeof data === 'object' &&
        data !== null &&
        'style' in data &&
        (data.style === 'unordered' || data.style === 'ordered') &&
        'items' in data &&
        Array.isArray(data.items) &&
        data.items.every(isListItem)
    )
}

function isListItem(item: unknown): item is ListItem {
    return (
        typeof item === 'object' &&
        item !== null &&
        'content' in item &&
        typeof item.content === 'string'
    )
}
