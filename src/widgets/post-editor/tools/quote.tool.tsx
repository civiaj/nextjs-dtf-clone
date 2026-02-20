import { isCaretAtEndOfInput, isCaretAtStartOfInput } from '@editorjs/caret'
import type { API, BlockAPI, SanitizerConfig } from '@editorjs/editorjs'
import { QuoteToolData } from '@/entities/editor'
import { EditorBlockArgs, EditorBlockTool } from '../model/types'

export interface QuoteConfig {
    quotePlaceholder: string
    captionPlaceholder: string
}

interface QuoteCSS {
    baseClass: string
    wrapper: string
    text: string
    caption: string
}

class Quote implements EditorBlockTool<QuoteToolData> {
    static get DEFAULT_QUOTE_PLACEHOLDER(): string {
        return 'Текст цитаты'
    }

    static get DEFAULT_CAPTION_PLACEHOLDER(): string {
        return 'Автор'
    }

    static get sanitize(): SanitizerConfig {
        return {
            text: {
                br: true
            },
            caption: {
                br: false
            }
        }
    }

    static get isReadOnlySupported(): boolean {
        return true
    }

    api: API
    block: BlockAPI
    element: HTMLQuoteElement
    data: QuoteToolData
    readOnly: boolean

    quote: HTMLParagraphElement
    caption: HTMLElement

    private css: QuoteCSS
    private config: QuoteConfig

    constructor({ data, config, api, readOnly, block }: EditorBlockArgs<Partial<QuoteConfig>>) {
        this.api = api
        this.block = block
        this.readOnly = readOnly

        this.css = {
            baseClass: this.api.styles.block,
            wrapper: 'quote-wrapper',
            text: 'quote-text',
            caption: 'quote-caption'
        }

        this.config = {
            captionPlaceholder: config?.captionPlaceholder ?? Quote.DEFAULT_CAPTION_PLACEHOLDER,
            quotePlaceholder: config?.quotePlaceholder ?? Quote.DEFAULT_QUOTE_PLACEHOLDER
        }

        this.data = this.normalize(data)
        this.element = this.getElement()
        this.quote = this.getQuoteElement()
        this.caption = this.getCaptionElement()

        if (!this.readOnly) {
            this.updateStyleBasedOnTextLength = this.updateStyleBasedOnTextLength.bind(this)
            this.onKeyDownCaption = this.onKeyDownCaption.bind(this)
            this.onKeyDownQuote = this.onKeyDownQuote.bind(this)
            this.onKeyUp = this.onKeyUp.bind(this)

            this.caption.addEventListener('keydown', this.onKeyDownCaption)
            this.caption.addEventListener('keyup', this.onKeyUp)
            this.quote.addEventListener('input', this.updateStyleBasedOnTextLength)
            this.quote.addEventListener('keydown', this.onKeyDownQuote)
            this.quote.addEventListener('keyup', this.onKeyUp)
        }

        this.updateStyleBasedOnTextLength()
    }

    normalize(data?: unknown): QuoteToolData {
        if (isQuoteData(data)) {
            return {
                text: data.text,
                caption: data.caption
            }
        }
        return { text: '', caption: '' }
    }

    getElement() {
        const tag = document.createElement('blockquote') as HTMLQuoteElement
        tag.classList.add(this.css.baseClass, this.css.wrapper)

        return tag
    }

    getCaptionElement() {
        const tag = document.createElement('cite')
        tag.innerHTML = this.data.caption || ''
        tag.classList.add(this.css.text, this.css.caption)
        tag.contentEditable = this.readOnly ? 'false' : 'true'
        tag.dataset.placeholder = this.config.captionPlaceholder
        return tag
    }

    getQuoteElement() {
        const tag = document.createElement('p')
        tag.innerHTML = this.data.text || ''
        tag.classList.add(this.css.text)
        tag.contentEditable = this.readOnly ? 'false' : 'true'
        tag.dataset.placeholder = this.config.quotePlaceholder
        return tag
    }

    render(): HTMLElement {
        this.element.appendChild(this.quote)
        this.element.appendChild(this.caption)

        return this.element
    }

    save(element: HTMLQuoteElement): QuoteToolData {
        const text = element.querySelector(`.${this.css.text}`)
        const caption = element.querySelector(`.${this.css.caption}`)

        return {
            text: text?.innerHTML ?? '',
            caption: caption?.innerHTML ?? ''
        }
    }

    validate(data: QuoteToolData): boolean {
        return data.text.trim() !== ''
    }

    destroy(): void {
        this.caption.removeEventListener('keydown', this.onKeyDownCaption)
        this.caption.removeEventListener('keyup', this.onKeyUp)
        this.quote.removeEventListener('input', this.updateStyleBasedOnTextLength)
        this.quote.removeEventListener('keydown', this.onKeyDownQuote)
        this.quote.removeEventListener('keyup', this.onKeyUp)
    }

    updateStyleBasedOnTextLength() {
        this.quote.classList.remove('quote-text-xl', 'quote-text-md', 'quote-text-sm')
        const textLength = this.quote.textContent?.length || 0
        if (textLength > 100) {
            this.quote.classList.add('quote-text-sm')
        } else if (textLength > 50) {
            this.quote.classList.add('quote-text-md')
        } else {
            this.quote.classList.add('quote-text-xl')
        }
    }

    onKeyUp(e: KeyboardEvent): void {
        if (e.code === 'Backspace' || e.code === 'Delete') {
            if (this.quote.textContent === '') {
                this.quote.innerHTML = ''
            }

            if (this.caption.textContent === '') {
                this.caption.innerHTML = ''
            }
        }
    }

    onKeyDownQuote(e: KeyboardEvent) {
        const isEnd = isCaretAtEndOfInput(this.quote)

        if (isEnd && (e.code === 'ArrowDown' || e.code === 'ArrowRight')) {
            e.preventDefault()
            e.stopPropagation()

            this.caption.focus()
        } else if (e.code === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            e.stopPropagation()

            this.caption.focus()
        }
    }

    onKeyDownCaption(e: KeyboardEvent) {
        const isStart = isCaretAtStartOfInput(this.caption)

        if (isStart && (e.code === 'ArrowUp' || e.code === 'ArrowLeft')) {
            e.preventDefault()
            e.stopPropagation()

            const range = document.createRange()
            const sel = window.getSelection()

            range.selectNodeContents(this.quote)
            range.collapse(false)

            sel?.removeAllRanges()
            sel?.addRange(range)
        }

        if (e.code === 'Enter') {
            e.preventDefault()
            e.stopPropagation()

            const currentIndex = this.api.blocks.getBlockIndex(this.block.id)
            this.api.blocks.insert('paragraph', {}, {}, currentIndex + 1)
            this.api.caret.setToBlock(currentIndex + 1, 'start')
        }
    }

    // rendered() {
    //     if (!this.wasFocused && this.element.contains(document.activeElement)) {
    //         Promise.resolve().then(() => {
    //             this.wasFocused = true
    //             this.api.caret.setToBlock(this.block.id, 'start')
    //         })
    //     }
    // }
}

export default Quote

function isQuoteData(data: unknown): data is QuoteToolData {
    return (
        typeof data === 'object' &&
        data !== null &&
        'text' in data &&
        typeof data.text === 'string' &&
        'caption' in data &&
        typeof data.caption === 'string'
    )
}
