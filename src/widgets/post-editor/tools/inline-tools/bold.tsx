import { API, InlineTool } from '@editorjs/editorjs'
import ReactDOM from 'react-dom/server'
import { BoldAppIcon } from '@/shared/icons'
import { InlineButtonCSS } from './types'

export class Bold implements InlineTool {
    api: API
    button: HTMLButtonElement
    private css: InlineButtonCSS

    static get isInline() {
        return true
    }

    static get sanitize() {
        return { b: true }
    }

    get shortcut(): string {
        return 'CMD+B'
    }

    private readonly commandName: string = 'bold'

    constructor({ api }: { api: API }) {
        this.api = api
        this.css = { button: 'ce-inline-tool-btn', active: 'ce-inline-tool-btn--active' }
        this.button = this.getElement()
    }

    getElement() {
        const button = document.createElement('button')
        button.type = 'button'
        button.innerHTML = ReactDOM.renderToString(<BoldAppIcon size={16} />)
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
