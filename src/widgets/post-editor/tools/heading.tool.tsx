import { isCaretAtStartOfInput } from '@editorjs/caret'
import { API, BlockAPI, PasteEvent } from '@editorjs/editorjs'
import { HeadingToolData } from '@/entities/editor'
import { EditorBlockArgs, EditorBlockTool } from '../model/types'

export interface HeadingConfig {
    levels: number[]
    defaultLevel: number
}

interface HeadingCSS {
    block: string
    wrapper: string
    button: string
}

interface Level {
    number: number
    tag: string
}

type HeadingToolDataRelaxed = Omit<HeadingToolData, 'level'> & { level: number }

export default class Heading implements EditorBlockTool<HeadingToolDataRelaxed> {
    static get sanitize() {
        return { level: false, text: {} }
    }

    static get isReadOnlySupported() {
        return true
    }

    static get pasteConfig() {
        return { tags: ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'] }
    }

    api: API
    block: BlockAPI
    headingElement: HTMLHeadingElement
    element: HTMLDivElement
    _data: HeadingToolDataRelaxed
    readOnly: boolean

    private css: HeadingCSS
    private config: HeadingConfig

    constructor({ data, config, api, readOnly, block }: EditorBlockArgs<Partial<HeadingConfig>>) {
        this.api = api
        this.block = block
        this.readOnly = readOnly

        this.css = {
            block: this.api.styles.block,
            wrapper: 'ce-header',
            button: 'ce-header__button'
        }

        this.config = {
            defaultLevel: config?.defaultLevel ?? 2,
            levels: config?.levels ?? [1, 2, 3, 4, 5, 6]
        }

        this._data = this.normalize(data)

        this.headingElement = this.getHeadingElement()
        this.element = this.getElement()

        this.setupEventListeners()
    }

    set data(data) {
        const prevLevel = this._data.level
        this._data = this.normalize(data)

        if (
            'level' in data &&
            prevLevel !== this._data.level &&
            this.headingElement.parentElement
        ) {
            this.removeEventListeners()
            const element = this.getHeadingElement()
            this.headingElement.parentElement.replaceChild(element, this.headingElement)
            this.headingElement = element
            this.setupEventListeners()
        }

        if (data.text) {
            this.headingElement.innerHTML = this._data.text
        }
    }

    get data() {
        this._data.text = this.headingElement.innerHTML
        this._data.level = this.currentLevel.number

        return this._data
    }

    normalize(data: object): HeadingToolDataRelaxed {
        if (isHeadingData(data)) {
            return {
                text: data.text,
                level: data.level
            }
        }

        return {
            text: 'text' in data && typeof data.text === 'string' ? data.text : '',
            level: this.config.defaultLevel
        }
    }

    getHeadingElement(): HTMLHeadingElement {
        const element = document.createElement(this.currentLevel.tag) as HTMLHeadingElement

        element.innerHTML = this._data.text || ''
        element.classList.add(this.css.wrapper)
        element.contentEditable = this.readOnly ? 'false' : 'true'
        element.dataset.placeholder = this.currentLevel.number === 1 ? 'Заголовок' : 'Подзаголовок'

        return element
    }

    getElement() {
        const element = document.createElement('div')
        element.appendChild(this.headingElement)
        element.classList.add(this.css.block)
        return element
    }

    setupEventListeners() {
        if (!this.readOnly) {
            this.onKeyDown = this.onKeyDown.bind(this)
            this.onKeyUp = this.onKeyUp.bind(this)

            this.headingElement.addEventListener('keydown', this.onKeyDown)
            this.headingElement.addEventListener('keyup', this.onKeyUp)
        }
    }

    removeEventListeners() {
        this.headingElement.removeEventListener('keydown', this.onKeyDown)
        this.headingElement.removeEventListener('keyup', this.onKeyUp)
    }

    render() {
        return this.element
    }

    merge(data: HeadingToolData): void {
        this.headingElement.insertAdjacentHTML('beforeend', data.text)
    }

    validate(data: HeadingToolData): boolean {
        return data.text.trim() !== '' && this.levels.some((level) => level.number === data.level)
    }

    save(): HeadingToolDataRelaxed {
        return this.data
    }

    destroy() {
        this.removeEventListeners()
    }

    onPaste(event: PasteEvent) {
        const detail = event.detail

        if ('data' in detail) {
            const content = detail.data as HTMLElement
            let level = this.defaultLevel.number

            switch (content.tagName) {
                case 'H1':
                    level = 1
                    break
                case 'H2':
                    level = 2
                    break
                case 'H3':
                    level = 3
                    break
                case 'H4':
                    level = 4
                    break
                case 'H5':
                    level = 5
                    break
                case 'H6':
                    level = 6
                    break
            }

            if (this.config.levels) {
                level = this.config.levels.reduce((prevLevel, currLevel) => {
                    return Math.abs(currLevel - level) < Math.abs(prevLevel - level)
                        ? currLevel
                        : prevLevel
                })
            }

            const index = this.api.blocks.getBlockIndex(this.block.id)

            if (index === 0) {
                level = 1
            } else if (level === 1) {
                level = this.defaultLevel.number
            }

            this.data = {
                ...this.data,
                level,
                text: content.innerHTML
            }
        }
    }

    onKeyDown(e: KeyboardEvent) {
        if (e.code === 'Enter') {
            const isStart = isCaretAtStartOfInput(this.headingElement)
            if (this.headingElement.textContent === '' || (isStart && this.data.level === 1)) {
                e.preventDefault()
                e.stopPropagation()
            }
        } else if (e.code === 'Space') {
            if (this.headingElement.textContent === '') {
                e.preventDefault()
                e.stopPropagation()
            }
        }
    }

    onKeyUp() {
        const { textContent } = this.headingElement

        if (textContent === '') {
            this.headingElement.innerHTML = ''
        }
    }

    get currentLevel(): Level {
        let level = this.levels.find((levelItem) => levelItem.number === this._data.level)

        if (!level) {
            level = this.defaultLevel
        }

        return level
    }

    get defaultLevel(): Level {
        if (this.config.defaultLevel) {
            const specified = this.levels.find((l) => l.number === this.config.defaultLevel)

            if (specified) return specified
        }

        return this.levels[1]
    }

    get levels(): Level[] {
        const levels = [
            {
                number: 1,
                tag: 'H1'
            },
            {
                number: 2,
                tag: 'H2'
            },
            {
                number: 3,
                tag: 'H3'
            },
            {
                number: 4,
                tag: 'H4'
            },
            {
                number: 5,
                tag: 'H5'
            },
            {
                number: 6,
                tag: 'H6'
            }
        ]

        return this.config.levels
            ? levels.filter((l) => this.config.levels!.includes(l.number))
            : levels
    }

    updateHeadingstyle({ style, level }: { style: HeadingDataStyle; level?: number }) {
        this.headingStyle = { style, level }
    }

    set headingStyle({ style, level }: { style: HeadingDataStyle; level?: number }) {
        switch (style) {
            case 'title': {
                this.data = { ...this.data, level: 1 }
                break
            }

            case 'heading': {
                this.data = { ...this.data, level: level ?? this.defaultLevel.number }
                break
            }

            default: {
                console.warn('Unknown heading style')
                break
            }
        }
    }

    get headingStyle(): HeadingDataStyle {
        if (this.data.level === 1) {
            return 'title'
        } else {
            return 'heading'
        }
    }
}

function isHeadingData(data: unknown): data is HeadingToolData {
    return (
        typeof data === 'object' &&
        data !== null &&
        'text' in data &&
        typeof data.text === 'string' &&
        'level' in data &&
        typeof data.level === 'number' &&
        !isNaN(data.level)
    )
}

export type HeadingDataStyle = 'title' | 'heading'
