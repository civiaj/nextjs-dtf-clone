import { API, BlockAPI, PasteEvent } from '@editorjs/editorjs'
import { CodeToolData } from '@/entities/editor'
import { EditorBlockArgs, EditorBlockTool } from '@/widgets/post-editor/model/types'

interface CodeConfig {
    placeholder: string
}

interface CodeToolCSS {
    baseClass: string
    glow: string
    wrapper: string
    textarea: string
}

export default class Code implements EditorBlockTool<CodeToolData> {
    static get isReadOnlySupported(): boolean {
        return true
    }

    static get enableLineBreaks(): boolean {
        return true
    }

    static get DEFAULT_PLACEHOLDER(): string {
        return '<script>alert("XSS")</script>'
    }

    static get pasteConfig() {
        return {
            tags: ['pre']
        }
    }

    static get sanitize() {
        return {
            code: true
        }
    }

    api: API
    block: BlockAPI
    element: HTMLTextAreaElement
    wrapper: HTMLDivElement
    data: CodeToolData
    readOnly: boolean

    private css: CodeToolCSS
    private config: CodeConfig

    constructor({ data, config, api, block, readOnly }: EditorBlockArgs<CodeConfig>) {
        this.api = api
        this.block = block
        this.readOnly = readOnly
        this.data = this.normalize(data)
        this.config = {
            placeholder: config?.placeholder ?? Code.DEFAULT_PLACEHOLDER
        }

        this.css = {
            baseClass: this.api.styles.block,
            glow: 'active-glow',
            wrapper: 'ce-code',
            textarea: 'ce-code__textarea'
        }

        this.element = this.getElement()
        this.wrapper = this.getWrapper()

        this.wrapper.appendChild(this.element)

        if (!this.readOnly) {
            this.onKeyDown = this.onKeyDown.bind(this)
            this.onInput = this.onInput.bind(this)
            this.element.addEventListener('keydown', this.onKeyDown)
            this.element.addEventListener('input', this.onInput)
        }
    }

    normalize(data?: unknown): CodeToolData {
        if (isCodeData(data)) {
            return {
                code: data.code
            }
        }

        return {
            code: ''
        }
    }

    getWrapper(): HTMLDivElement {
        const tag = document.createElement('div') as HTMLDivElement
        tag.classList.add(this.css.baseClass, this.css.wrapper)

        return tag
    }

    getElement(): HTMLTextAreaElement {
        const textarea = document.createElement('textarea') as HTMLTextAreaElement
        textarea.classList.add(this.css.textarea, this.css.glow)
        textarea.value = this.data.code
        textarea.placeholder = this.config.placeholder

        if (this.readOnly) textarea.disabled = true

        return textarea
    }

    public render() {
        return this.wrapper
    }

    public save(element: HTMLDivElement): CodeToolData {
        const textarea = element.querySelector('textarea') as HTMLTextAreaElement
        return {
            code: textarea.value
        }
    }

    validate(savedData: CodeToolData): boolean {
        return savedData.code.trim() !== ''
    }

    public onPaste(event: PasteEvent): void {
        const detail = event.detail

        if ('data' in detail) {
            const content = detail.data as string

            this.data = {
                code: content || ''
            }
        }
    }

    private tabHandler(event: KeyboardEvent): void {
        event.stopPropagation()
        event.preventDefault()

        const textarea = event.target as HTMLTextAreaElement
        const isShiftPressed = event.shiftKey
        const caretPosition = textarea.selectionStart
        const value = textarea.value
        const indentation = '  '

        let newCaretPosition

        /**
         * For Tab pressing, just add an indentation to the caret position
         */
        if (!isShiftPressed) {
            newCaretPosition = caretPosition + indentation.length

            textarea.value =
                value.substring(0, caretPosition) + indentation + value.substring(caretPosition)
        } else {
            /**
             * For Shift+Tab pressing, remove an indentation from the start of line
             */
            const currentLineStart = getLineStartPosition(value, caretPosition)
            const firstLineChars = value.substr(currentLineStart, indentation.length)

            if (firstLineChars !== indentation) {
                return
            }

            /**
             * Trim the first two chars from the start of line
             */
            textarea.value =
                value.substring(0, currentLineStart) +
                value.substring(currentLineStart + indentation.length)
            newCaretPosition = caretPosition - indentation.length
        }

        /**
         * Restore the caret
         */
        textarea.setSelectionRange(newCaretPosition, newCaretPosition)
    }

    onKeyDown(e: KeyboardEvent) {
        switch (e.code) {
            case 'Tab':
                this.tabHandler(e)
                break
        }
    }

    onInput() {
        updateTextareaHeight(this.element)
    }

    destroy() {
        this.element.removeEventListener('keydown', this.onKeyDown)
    }

    rendered() {
        updateTextareaHeight(this.element)
    }
}

function getLineStartPosition(string: string, position: number): number {
    const charLength = 1
    let char = ''

    while (char !== '\n' && position > 0) {
        position = position - charLength
        char = string.substring(position, charLength)
    }

    if (char === '\n') {
        position += 1
    }

    return position
}

function isCodeData(data?: unknown): data is CodeToolData {
    return (
        typeof data === 'object' && data !== null && 'code' in data && typeof data.code === 'string'
    )
}

function updateTextareaHeight(textarea: HTMLTextAreaElement) {
    textarea.style.height = 'auto'
    textarea.style.setProperty('--textarea-height', `${Math.max(textarea.scrollHeight, 80)}px`)
    textarea.style.height = 'var(--textarea-height)'
}
