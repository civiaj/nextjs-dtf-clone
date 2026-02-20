import type {
    API,
    BlockAPI,
    HTMLPasteEvent,
    PasteConfig,
    SanitizerConfig
} from '@editorjs/editorjs'
import { ParagraphToolData } from '@/entities/editor'
import { EditorBlockArgs, EditorBlockTool } from '../model/types'

export interface ParagraphConfig {
    placeholder: string
    preserveBlank: boolean
}

interface ParagraphCSS {
    block: string
    wrapper: string
}

let hasSpecialPlaceholder = false

export default class Paragraph implements EditorBlockTool<ParagraphToolData> {
    static get DEFAULT_PLACEHOLDER() {
        return ''
    }

    static get sanitize(): SanitizerConfig {
        return { text: { br: true } }
    }

    static get isReadOnlySupported(): boolean {
        return true
    }

    static get pasteConfig(): PasteConfig {
        return { tags: ['P'] }
    }

    // static get enableLineBreaks(): boolean {
    //     return true
    // }

    api: API
    block: BlockAPI
    element: HTMLParagraphElement
    data: ParagraphToolData
    readOnly: boolean

    private css: ParagraphCSS
    private config: ParagraphConfig

    constructor({ data, config, api, readOnly, block }: EditorBlockArgs<Partial<ParagraphConfig>>) {
        this.api = api
        this.block = block
        this.readOnly = readOnly

        this.css = {
            block: this.api.styles.block,
            wrapper: 'ce-paragraph'
        }

        this.config = {
            placeholder: config?.placeholder ?? Paragraph.DEFAULT_PLACEHOLDER,
            preserveBlank: config?.preserveBlank ?? false
        }

        this.data = this.normalize(data)
        this.element = this.getElement()

        if (!this.readOnly) {
            this.onKeyDown = this.onKeyDown.bind(this)
            this.onKeyUp = this.onKeyUp.bind(this)

            this.element.addEventListener('keydown', this.onKeyDown)
            this.element.addEventListener('keyup', this.onKeyUp)
        }
    }

    normalize(data?: unknown): ParagraphToolData {
        if (isParagraphData(data)) {
            return {
                text: data.text
            }
        }

        return {
            text:
                data && typeof data === 'object' && 'text' in data && typeof data.text === 'string'
                    ? data.text
                    : ''
        }
    }

    getElement(): HTMLParagraphElement {
        const tag = document.createElement('p') as HTMLParagraphElement
        tag.innerHTML = this.data.text || ''
        tag.classList.add(this.css.block, this.css.wrapper)
        tag.contentEditable = this.readOnly ? 'false' : 'true'
        tag.dataset.placeholderActive = this.config.placeholder

        return tag
    }

    render() {
        return this.element
    }

    merge(data: ParagraphToolData): void {
        this.data.text += data.text
        const fragment = makeFragment(data.text)
        this.element.appendChild(fragment)
        this.element.normalize()
    }

    validate(data: ParagraphToolData): boolean {
        if (data.text.trim() === '' && !this.config.preserveBlank) {
            return false
        }

        return true
    }

    save(element: HTMLParagraphElement): ParagraphToolData {
        return {
            text: element.innerHTML
        }
    }

    destroy() {
        this.element.removeEventListener('keydown', this.onKeyDown)
        this.element.removeEventListener('keyup', this.onKeyUp)
    }

    onPaste(event: HTMLPasteEvent): void {
        this.data.text = event.detail.data.innerHTML

        window.requestAnimationFrame(() => {
            if (!this.element) return
            this.element.innerHTML = this.data.text || ''
        })
    }

    onKeyDown(e: KeyboardEvent) {
        if (e.code === 'Enter') {
            if (this.element.innerHTML === '') {
                e.preventDefault()
                e.stopPropagation()
            }
        } else if (e.code === 'Space') {
            if (this.element.innerHTML === '') {
                e.preventDefault()
                e.stopPropagation()
            }
        }
    }

    onKeyUp(): void {
        const { textContent } = this.element

        if (textContent === '') {
            this.element.innerHTML = ''
        }
    }

    async rendered() {
        if (!hasSpecialPlaceholder) {
            hasSpecialPlaceholder = true
            this.element.dataset.placeholderActive =
                PLACEHOLDERS[Math.floor(Math.random() * PLACEHOLDERS.length)]
        }
    }
}

function makeFragment(htmlString: string): DocumentFragment {
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = htmlString.trim()
    const fragment = document.createDocumentFragment()
    fragment.append(...Array.from(tempDiv.childNodes))
    return fragment
}

function isParagraphData(data: unknown): data is ParagraphToolData {
    return (
        typeof data === 'object' && data !== null && 'text' in data && typeof data.text === 'string'
    )
}

const PLACEHOLDERS = [
    'Сегодня попробовал новый пельмень — и это было как откровение!',
    'Как я играю в эту игру и до сих пор не могу пройти первый уровень... Да, это судьба.',
    'Когда случайно запустил старый фильм и понял, что у меня целый вечер уйдёт на обсуждения — это магия.',
    'Почему у меня всегда в кинотеатр ходит кто-то с чипсами, которые пахнут на весь зал?',
    'Никогда не понимал, почему все говорят "обнови приложение" — я всегда без обновлений как без рук.',
    'Успел съесть одну порцию попкорна за первый трейлер, и теперь этот фильм ещё не начался.',
    'Зашёл в магазин за хлебом, а ушёл с целым арсеналом еды, которой не знал, что мне нужно.',
    'Что за странные игры? Я вообще-то пришёл просто отдохнуть, а тут началась настоящая борьба за выживание.',
    'Смотрю на новый тренд и думаю: "Почему я не придумал это 10 лет назад?"',
    'Как объяснить бабушке, что фастфуд — это не всегда плохо, если у тебя нет времени готовить?',
    'Мой кот и я играем в очень странную игру: я лежу, а он решает, кто из нас сегодня победитель.',
    'Когда Netflix спрашивает: "Хотите продолжить просмотр?", я всегда думаю: "Нет, хочу новый сезон!"',
    'Были ли у вас когда-нибудь такие моменты, когда вы запустили игру и забыли, зачем вообще её начали?',
    'Вчера пытался объяснить другу, что в этой игре не всё так серьёзно, но он всё равно сдался на первом уровне.',
    'Смотрю на новые тренды в TikTok и думаю, что моя жизнь намного скучнее, чем я думал.',
    'Кажется, я съел все чипсы, пока пытался понять, как это работает... Это не мой день.',
    'Зашёл в магазин за молоком, а вышел с тремя пакетами чая и шоколадкой.',
    'Если честно, я всё ещё не понял, почему все так любят "старые добрые" игры. Наверное, я слишком молот для этого.',
    'Смотрю на новый фильм, а он, оказывается, продолжение старого фильма, который я тоже не понял.',
    'Я вот тоже хочу быть частью тренда, но боюсь, что мне будет неудобно в этих кроссовках.',
    'Вспомнил вчера, как пять лет назад вонял мой старый ноутбук... И как я тогда думал, что это нормально.',
    'Когда твой друг пытается объяснить тебе, как пройти уровень, а ты в его объяснениях всё равно теряешься.',
    'Почему всегда, когда я смотрю что-то забавное в интернете, я забываю, как это называется?',
    'Когда на работе тебе говорят "работай с этим документом", а ты даже не знаешь, где он.',
    'Как объяснить друзьям, что я только что обжёгся о чашку кофе, хотя я просто пытался её поставить на стол?',
    'Кажется, я всё же не понимаю, как люди успевают играть в эти игры и ещё работать.',
    'Почему все считают, что посмотреть "новое кино" — это значит потратить 2 часа на очередной супергеройский фильм?',
    'Мой кот сидит на клавиатуре, пока я не могу сделать даже один нормальный скриншот.',
    'Когда ты играешь в новую игру, а твой персонаж постоянно падает в пропасть. Классика.',
    'Посмотрел старое видео и понял, что так и не научился смеяться с таких вещей. Видимо, я стал серьёзным.',
    'Где бы я ни был, всегда кажется, что я забыл что-то важное. Сегодня это оказался мой зарядник.',
    'Вчера решил улучшить свою жизнь, но снова забыл выключить уведомления на телефоне.',
    'Как можно ненавидеть работу в офисе, если там хотя бы есть еда и кофе?',
    'Сегодня я сыграл в такую игру, что мне понадобилось две чашки кофе, чтобы восстановить нервную систему.',
    'Может, мне стоит записать серию постов про то, как я не умею пользоваться стикерами в чате?',
    'Захотел сделать что-то полезное, но сразу забыл, что хотел. Зачем я вообще пытался?',
    'Посмотрел фильм про вампиров, и теперь думаю, что в следующей жизни буду вампиром. Если это возможно.',
    'Вчера, увидев рекламу нового гаджета, думал, что он спасёт мир. Сегодня я не уверен.',
    'Почему каждый раз, когда я обещаю себе "пойти поиграть", мне приходится искать зарядку и обновлять игру?',
    'Что делать, если мне понравился фильм, но все мои друзья говорят, что он "слишком скучный"?',
    'Я, конечно, стараюсь быть креативным, но зачем я только что выбрал этот шрифт?'
]
