import React from 'react'
import { API, BlockAPI } from '@editorjs/editorjs'
import ReactDOM, { Root } from 'react-dom/client'
import { RichContent } from '@/components/RichContent'
import { LinkToolData, editorService } from '@/entities/editor'
import { formatErrorMessage } from '@/lib/error'
import { getStore } from '@/lib/store'
import { showToast } from '@/shared/ui/toaster'
import { imageSchema } from '@/shared/validation/media.validation'
import { EditorBlockArgs, EditorBlockTool } from '../model/types'

export default class Link implements EditorBlockTool<LinkToolData | LinkInput> {
    static get isReadOnlySupported() {
        return true
    }

    static get enableLineBreaks() {
        return false
    }

    api: API
    block: BlockAPI
    element: HTMLDivElement
    data: LinkToolData | LinkInput
    readOnly: boolean

    private css: LinkCSS
    private isLoading: boolean
    private root: Root
    private wasFocused: boolean

    constructor({ data, block, api, readOnly }: EditorBlockArgs<undefined>) {
        this.api = api
        this.block = block
        this.readOnly = readOnly

        this.css = {
            block: this.api.styles.block
        }

        this.wasFocused = false
        this.data = this.normalize(data)
        this.element = this.getElement()
        this.root = ReactDOM.createRoot(this.element)

        this.isLoading = false
    }

    normalize(data: unknown): LinkToolData | LinkInput {
        if (isLinkData(data))
            return {
                description: data.description,
                hostname: data.hostname,
                image: data.image,
                title: data.title,
                url: data.url
            }

        return { url: '' }
    }

    getElement(): HTMLDivElement {
        const tag = document.createElement('div')

        tag.classList.add(this.css.block)

        return tag
    }

    render() {
        if (isLinkData(this.data)) {
            this.renderRichContent()
        } else {
            this.renderInput()
        }

        return this.element
    }

    rendered() {
        if (!this.wasFocused && !isLinkData(this.data)) {
            Promise.resolve().then(() => {
                this.wasFocused = true
                this.api.caret.setToBlock(this.block.id, 'start')
            })
        }
    }

    save() {
        return {
            ...this.data
        }
    }

    validate() {
        if (isLinkData(this.data)) {
            return this.data.url !== ''
        }
        return false
    }

    renderInput() {
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            this.data = { ...this.data, url: e.target.value }
            this.renderInput()
        }
        const handleKeyDown = (e: React.KeyboardEvent) => {
            if (e.key === 'Enter') {
                e.preventDefault()
                e.stopPropagation()
                this.fetchURL()
            }
        }
        const handlePaste = (e: React.ClipboardEvent) => {
            const url = e.clipboardData.getData('text')
            this.data.url = url
            this.fetchURL()
        }

        this.root.render(
            <Input
                disabled={this.isLoading || this.readOnly}
                value={this.data.url ?? ''}
                handleChange={handleChange}
                handleKeyDown={handleKeyDown}
                handlePaste={handlePaste}
            />
        )
    }

    renderRichContent() {
        this.root.render(<RichContent {...(this.data as LinkToolData)} />)
    }

    async fetchURL() {
        try {
            this.isLoading = true
            this.renderInput()

            const { result } = await getStore()
                .dispatch(
                    editorService.endpoints.getLinkPreview.initiate(this.data.url, {
                        subscribe: false
                    })
                )
                .unwrap()

            this.data = { ...this.data, ...result }
            this.renderRichContent()
        } catch (error) {
            this.isLoading = false
            this.renderInput()
            showToast('warning', { description: formatErrorMessage(error) })
        } finally {
            this.isLoading = false
        }
    }

    destroy(): void {
        queueMicrotask(() => this.root.unmount())
    }
}

interface LinkInput {
    url: string
}

const Input = ({
    handleChange,
    handleKeyDown,
    handlePaste,
    value,
    disabled
}: {
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    handleKeyDown: (e: React.KeyboardEvent) => void
    handlePaste: (e: React.ClipboardEvent) => void
    value: string
    disabled: boolean
}) => {
    return (
        <div className='active-glow'>
            <input
                disabled={disabled}
                placeholder='Вставьте ссылку'
                autoFocus
                className='w-full px-3 py-2 outline-none'
                value={value}
                type='text'
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                onPaste={handlePaste}
            />
        </div>
    )
}

interface LinkCSS {
    block: string
}

function isLinkData(data: unknown): data is LinkToolData {
    return (
        typeof data === 'object' &&
        data !== null &&
        'description' in data &&
        typeof data.description === 'string' &&
        'hostname' in data &&
        typeof data.hostname === 'string' &&
        'url' in data &&
        typeof data.url === 'string' &&
        'title' in data &&
        typeof data.title === 'string' &&
        'image' in data &&
        imageSchema.safeParse(data.image).success
    )
}
