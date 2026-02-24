import type { API, BlockAPI } from '@editorjs/editorjs'
import ReactDOM, { Root } from 'react-dom/client'
import { MediaToolData } from '@/entities/editor'
import { imageSchema, videoSchema } from '@/shared/validation/media.validation'
import { EditorBlockArgs, EditorBlockTool } from '@/widgets/post-editor/model/types'
import { EditorBlockMedia } from './components'

type Config = {
    limit: number
    endpoint: string
}

type CSS = {
    block: string
}

export default class ImageTool implements EditorBlockTool<MediaToolData> {
    api: API
    block: BlockAPI
    element: HTMLDivElement
    data: MediaToolData
    readOnly: boolean

    private css: CSS
    private config: Config
    private root: Root
    private initialData: MediaToolData['items']

    constructor({ data, config, api, readOnly, block }: EditorBlockArgs<Config>) {
        this.api = api
        this.block = block
        this.readOnly = readOnly

        this.css = {
            block: 'ce-media'
        }
        this.config = {
            endpoint: config?.endpoint ?? '',
            limit: config?.limit ?? 10
        }

        this.data = this.normalize(data)
        this.initialData = this.data.items
        this.element = this.getElement()
        this.root = ReactDOM.createRoot(this.element)
    }

    normalize(data: unknown): MediaToolData {
        if (isMediaData(data)) return { items: data.items.concat() }
        return { items: [] }
    }

    getElement(): HTMLDivElement {
        const tag = document.createElement('div')

        tag.classList.add(this.css.block)

        return tag
    }

    render(): HTMLDivElement {
        this.renderGallery()
        return this.element
    }

    renderGallery() {
        this.root.render(
            <EditorBlockMedia
                initialData={this.initialData}
                limit={this.config.limit}
                onMediaChange={this.onMediaChange.bind(this)}
            />
        )
    }

    validate() {
        return this.data.items.length !== 0
    }

    save() {
        return {
            items: this.data.items,
            isCover: this.element.dataset.cover === 'true',
            isHidden: this.element.dataset.hidden === 'true'
        }
    }

    onMediaChange(items: MediaToolData['items']) {
        try {
            this.data.items = items
            this.block.dispatchChange()
        } catch {}
    }

    rendered(): void {
        if (this.data.items.length !== 0) return

        requestAnimationFrame(() => {
            const input = this.element.querySelector('input')
            input?.click()
        })
    }

    destroy() {
        requestAnimationFrame(() => {
            this.root.unmount()
        })
    }
}

function isMediaData(data: unknown): data is MediaToolData {
    return (
        typeof data === 'object' &&
        data !== null &&
        'items' in data &&
        Array.isArray(data.items) &&
        data.items.every((item) => {
            return (
                'text' in item &&
                typeof item.text === 'string' &&
                'media' in item &&
                typeof item.media === 'object' &&
                item.media !== null &&
                'type' in item.media &&
                typeof item.media.type === 'string' &&
                ((item.media.type === 'image' && imageSchema.safeParse(item.media).success) ||
                    (item.media.type === 'video' && videoSchema.safeParse(item.media).success))
            )
        })
    )
}
