import { API, InlineTool } from '@editorjs/editorjs'
import ReactDOM from 'react-dom/server'
import { LinkAppIcon, PlusAppIcon, SliderLeftAppIcon, TrashAppIcon } from '@/shared/icons'
import { showToast } from '@/shared/ui/toaster'
import { InlineButtonCSS } from './types'

export default class LinkInlineTool implements InlineTool {
    static get isInline() {
        return true
    }

    public static get sanitize() {
        return {
            a: {
                href: true,
                target: '_blank',
                rel: 'nofollow'
            }
        }
    }

    private readonly commandLink: string = 'createLink'
    private readonly commandUnlink: string = 'unlink'

    api: API
    nodes: LinkInlineToolNodes
    private css: InlineButtonCSS & { input: string; wrapper: string }
    initialValue: string

    constructor({ api }: { api: API }) {
        this.api = api
        this.css = {
            wrapper: 'ce-inline-tool-wrapper',
            button: 'ce-inline-tool-btn',
            active: 'ce-inline-tool-btn--active',
            input: 'ce-inline-input'
        }

        this.nodes = {
            wrapper: null,
            button: null,
            buttonRemove: null,
            buttonReturn: null,
            buttonSave: null,
            input: null
        }

        this.onClick = this.onClick.bind(this)
        this.onKeyDown = this.onKeyDown.bind(this)
        this.onInput = this.onInput.bind(this)
        this.onFocus = this.onFocus.bind(this)

        this.initialValue = this.api.selection.findParentTag('A')?.getAttribute('href') ?? ''
        this.api.selection.save()
    }

    createNode(nodeName: keyof LinkInlineToolNodes) {
        switch (nodeName) {
            case 'wrapper': {
                const wrapper = document.createElement('div')
                wrapper.classList.add(this.css.wrapper)
                this.nodes.wrapper = wrapper
                break
            }

            case 'button': {
                const button = document.createElement('button')
                button.type = 'button'
                button.setAttribute('data-command', 'open')
                button.innerHTML = ReactDOM.renderToString(<LinkAppIcon size={16} />)
                button.classList.add(this.css.button)

                if (this.isActive) {
                    button.classList.add(this.css.active)
                }

                this.nodes.button = button
                this.nodes.button.addEventListener('click', this.onClick)
                break
            }

            case 'buttonRemove': {
                const button = document.createElement('button')
                button.type = 'button'
                button.setAttribute('data-command', 'remove')
                button.innerHTML = ReactDOM.renderToString(<TrashAppIcon size={16} />)
                button.classList.add(this.css.button)

                this.nodes.buttonRemove = button
                this.nodes.buttonRemove.addEventListener('click', this.onClick)
                break
            }

            case 'buttonReturn': {
                const button = document.createElement('button')
                button.type = 'button'
                button.setAttribute('data-command', 'return')
                button.innerHTML = ReactDOM.renderToString(<SliderLeftAppIcon size={16} />)
                button.classList.add(this.css.button)
                this.nodes.buttonReturn = button
                this.nodes.buttonReturn.addEventListener('click', this.onClick)
                break
            }

            case 'buttonSave': {
                const button = document.createElement('button')
                button.type = 'button'
                button.setAttribute('data-command', 'save')
                button.innerHTML = ReactDOM.renderToString(<PlusAppIcon size={16} />)
                button.classList.add(this.css.button, this.css.active)
                this.nodes.buttonSave = button
                this.nodes.buttonSave.addEventListener('click', this.onClick)
                break
            }

            case 'input': {
                const input = document.createElement('input')
                input.type = 'text'
                input.classList.add(this.css.input)
                input.enterKeyHint = 'done'

                input.placeholder = this.initialValue || 'Вставьте ссылку'
                if (this.initialValue) {
                    input.setAttribute('data-initial', String(Boolean(this.initialValue)))
                }

                this.nodes.input = input
                this.nodes.input.addEventListener('keydown', this.onKeyDown)
                this.nodes.input.addEventListener('input', this.onInput)
                this.nodes.input.addEventListener('focus', this.onFocus)
                break
            }
        }
    }

    surround() {}

    public render() {
        this.createNode('wrapper')
        this.deactivateLinkElement()
        return this.nodes.wrapper!
    }

    checkState() {
        return this.isActive
    }

    activateLinkElement() {
        this.removeListeners()
        this.createNode('buttonRemove')
        this.createNode('buttonReturn')
        this.createNode('input')

        this.nodes.wrapper!.innerHTML = ''
        this.nodes.wrapper!.append(
            this.nodes.buttonReturn!,
            this.nodes.input!,
            this.nodes.buttonRemove!
        )
        document.querySelector('.ce-inline-toolbar')?.classList.add('ce-popover__items--link')
    }

    deactivateLinkElement() {
        this.removeListeners()
        this.createNode('button')
        this.nodes.wrapper!.innerHTML = ''
        this.nodes.wrapper!.append(this.nodes.button!)
        document.querySelector('.ce-inline-toolbar')?.classList.remove('ce-popover__items--link')
    }

    removeListeners() {
        this.nodes.button?.removeEventListener('click', this.onClick)
        this.nodes.buttonRemove?.removeEventListener('click', this.onClick)
        this.nodes.buttonReturn?.removeEventListener('click', this.onClick)
        this.nodes.input?.removeEventListener('keydown', this.onKeyDown)
        this.nodes.input?.removeEventListener('input', this.onInput)
        this.nodes.input?.removeEventListener('focus', this.onFocus)
    }

    onClick(e: MouseEvent) {
        if (!(e.currentTarget instanceof HTMLElement)) return

        const action = e.currentTarget.getAttribute('data-command')

        switch (action) {
            case 'open': {
                this.activateLinkElement()
                break
            }
            case 'remove': {
                this.unlink()
                break
            }
            case 'return': {
                this.deactivateLinkElement()
                break
            }
            case 'save': {
                this.insertLink()
                break
            }
        }

        e.stopImmediatePropagation()
        e.stopPropagation()
        e.preventDefault()
    }

    onKeyDown(e: KeyboardEvent) {
        if (e.code === 'Enter') {
            e.preventDefault()
            e.stopPropagation()
            e.stopImmediatePropagation()
            this.insertLink()
        }
    }

    onInput() {
        const value = this.nodes.input?.value ?? ''
        const isEmpty = value.trim().length === 0

        if (!this.nodes.buttonSave) this.createNode('buttonSave')

        if (!isEmpty) {
            const exist = this.nodes.wrapper!.contains(this.nodes.buttonSave!)

            if (exist) return

            const input = this.nodes.wrapper!.querySelector(`.${this.css.input}`)
            input?.insertAdjacentElement('afterend', this.nodes.buttonSave!)
        } else {
            this.nodes.buttonSave?.remove()
        }
    }

    onFocus() {
        if (this.nodes.input && this.nodes.input.hasAttribute('data-initial')) {
            this.nodes.input.value = this.nodes.input.placeholder
            this.nodes.input.placeholder = 'Вставьте ссылку'
            this.nodes.input.removeAttribute('data-initial')
        }
    }

    insertLink() {
        let value = this.nodes.input!.value ?? ''

        if (!value.trim()) {
            this.unlink()
            return
        }

        value = this.prepareLink(value)

        if (!this.validateLink(value)) {
            showToast('warning', { description: 'Некорректная ссылка' })
            return
        }

        this.api.selection.restore()

        // if (this.isActive) {
        //     this.api.selection.expandToTag(this.parentAnchor!)
        // }

        document.execCommand(this.commandLink, false, value)
        this.api.inlineToolbar.close()
        this.collapseSelectionToEnd()
    }

    validateLink(link: string) {
        const urlRegex =
            /^(https?:\/\/)?([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}(:\d{1,5})?(\/[^\s#?]*)?(\?[^\s#]*)?(#[^\s]*)?$/

        return urlRegex.test(link)
    }

    prepareLink(link: string): string {
        link = link.trim()
        return link
    }

    unlink() {
        this.api.selection.restore()

        // if (this.isActive) {
        //     this.api.selection.expandToTag(this.parentAnchor!)
        // }

        document.execCommand(this.commandUnlink)
        this.api.inlineToolbar.close()
        this.collapseSelectionToEnd()
    }

    get isActive() {
        return this.initialValue.length !== 0
    }

    clear(): void {
        this.removeListeners()
    }

    private collapseSelectionToEnd(): void {
        const selection = window.getSelection()

        if (!selection || selection.rangeCount === 0) return

        const range = selection.getRangeAt(0)
        const newNode = range.cloneRange()

        newNode.collapse(false)

        selection.removeAllRanges()
        selection.addRange(newNode)
    }
}

type LinkInlineToolNodes = {
    wrapper: null | HTMLDivElement
    button: null | HTMLButtonElement
    buttonReturn: null | HTMLButtonElement
    buttonRemove: null | HTMLButtonElement
    buttonSave: null | HTMLButtonElement
    input: null | HTMLInputElement
}
