import { API, InlineTool } from '@editorjs/editorjs'
import ReactDOM from 'react-dom/server'
import { ItalicAppIcon } from '@/shared/icons'
import { InlineButtonCSS } from './types'

export class Italic implements InlineTool {
    api: API
    button: HTMLButtonElement
    private css: InlineButtonCSS

    static get isInline() {
        return true
    }

    static get sanitize() {
        return { i: true }
    }

    get shortcut(): string {
        return 'CMD+I'
    }

    private readonly commandName: string = 'italic'

    constructor({ api }: { api: API }) {
        this.api = api
        this.css = { button: 'ce-inline-tool-btn', active: 'ce-inline-tool-btn--active' }
        this.button = this.getElement()
    }

    getElement() {
        const button = document.createElement('button')
        button.type = 'button'
        button.innerHTML = ReactDOM.renderToString(<ItalicAppIcon size={16} />)
        button.classList.add(this.css.button)
        return button
    }

    render() {
        return this.button
    }

    surround() {
        this.api.selection.restore()
        document.execCommand(this.commandName)
    }

    checkState() {
        if (this.isActive) {
            this.button.classList.add(this.css.active)
        } else {
            this.button.classList.remove(this.css.active)
        }

        return true
    }

    get isActive() {
        return document.queryCommandState(this.commandName)
    }
}
