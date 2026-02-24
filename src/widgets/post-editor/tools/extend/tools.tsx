import { useCallback, useMemo, useState } from 'react'
import { API, BlockAPI } from '@editorjs/editorjs'
import { LucideIcon } from 'lucide-react'
import ReactDOM, { Root } from 'react-dom/client'
import {
    CodeAppIcon,
    DownAppIcon,
    EditAppIcon,
    EyeCloseAppIcon,
    EyeOpenAppIcon,
    HeaderAppIcon,
    LinkAppIcon,
    ListAppIcon,
    MediaAppIcon,
    PlusAppIcon,
    QuoteAppIcon,
    SearchAppIcon,
    SeparatorAppIcon,
    StarAppIcon,
    TextAppIcon,
    TrashAppIcon,
    UpAppIcon
} from '@/shared/icons'
import { Button } from '@/shared/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from '@/shared/ui/dropdown-menu'
import { Input } from '@/shared/ui/input'
import { ScrollArea } from '@/shared/ui/scroll-area'
import BlockActions from './actions'
import BlockMeta from './meta'
import BlockState from './state'

interface BlockFlagsCSS {
    block: string
}

export default class BlockTools {
    api: API
    block: BlockAPI
    container: HTMLDivElement
    root: Root
    actions: BlockActions
    state: BlockState
    meta: BlockMeta

    private CSS: BlockFlagsCSS

    constructor({
        block,
        api,
        actions,
        state,
        meta
    }: {
        api: API
        block: BlockAPI
        actions: BlockActions
        state: BlockState
        meta: BlockMeta
    }) {
        this.api = api
        this.block = block
        this.CSS = { block: 'ce-tools' }
        this.container = this.getContainer()
        this.root = ReactDOM.createRoot(this.container)
        this.actions = actions
        this.state = state
        this.meta = meta

        this.render = this.render.bind(this)
        this.state.addEventListener('state-update', this.render)
        this.state.addEventListener('tools-open', this.render)
    }

    destroy() {
        this.state.removeEventListener('state-update', this.render)
        this.state.removeEventListener('tools-open', this.render)
        this.root.unmount()
    }

    getContainer() {
        const div = document.createElement('div')
        div.classList.add(this.CSS.block)
        return div
    }

    render() {
        const { isEmpty } = this.meta
        const isOpen = this.state.isOpen(this.block.id)

        const onOpenChange = (value: boolean) => {
            if (value) {
                this.state.setOpenId(this.block.id)
            } else {
                if (this.state.openId === this.block.id) {
                    this.state.setOpenId(null)
                }
            }
            this.render()
        }

        this.root.render(
            isEmpty ? (
                <CreateMenu
                    isOpen={isOpen}
                    onOpenChange={onOpenChange}
                    options={this.getCreateOptions()}
                />
            ) : (
                <EditMenu
                    key={this.block.id}
                    isOpen={isOpen}
                    onOpenChange={onOpenChange}
                    options={this.getEditOptions()}
                />
            )
        )
    }

    getCreateOptions() {
        const options: Option[] = [
            {
                Icon: TextAppIcon,
                label: 'Текст',
                shouldClose: true,
                onActivate: () => this.actions.create('paragraph', true)
            },
            {
                Icon: HeaderAppIcon,
                label: 'Заголовок',
                shouldClose: true,
                onActivate: () => this.actions.create('heading', true)
            },
            {
                Icon: ListAppIcon,
                label: 'Список',
                shouldClose: true,
                onActivate: () => this.actions.create('list', true)
            },
            {
                Icon: MediaAppIcon,
                label: 'Фото или видео',
                shouldClose: true,
                onActivate: () => this.actions.create('media', false)
            },
            {
                Icon: LinkAppIcon,
                label: 'Ссылка',
                shouldClose: true,
                onActivate: () => this.actions.create('link', true)
            },
            {
                Icon: QuoteAppIcon,
                label: 'Цитата',
                shouldClose: true,
                onActivate: () => this.actions.create('quote', true)
            },
            {
                Icon: SeparatorAppIcon,
                label: 'Разделитель',
                shouldClose: true,
                onActivate: () => this.actions.create('separator', false)
            },
            {
                Icon: CodeAppIcon,
                label: 'Код',
                shouldClose: true,
                onActivate: () => this.actions.create('code', true)
            }
        ]

        return options
    }

    getEditOptions() {
        const { isCover, isHidden } = this.state
        const { isOrdered, isTitle, isUnordered } = this.meta

        {
            const feedOptions: Option[] = [
                {
                    Icon: isHidden ? EyeOpenAppIcon : EyeCloseAppIcon,
                    label: isHidden ? 'Показать содержание' : 'Скрыть содержание',
                    isActive: isHidden,
                    onActivate: () => {
                        this.state.setHidden(!isHidden)
                    }
                },
                {
                    Icon: StarAppIcon,
                    label: isCover ? 'Убрать из ленты' : 'Вывести в ленте',
                    isActive: isCover,
                    onActivate: () => this.state.setCover(!isCover)
                }
            ]

            const editOptions: Option[] = [
                {
                    Icon: UpAppIcon,
                    label: 'Переместить вверх',
                    onActivate: () => {
                        this.actions.move(-1).then(() => {
                            this.render()
                        })
                    }
                },
                {
                    Icon: DownAppIcon,
                    label: 'Переместить вниз',
                    onActivate: () => {
                        this.actions.move(1).then(() => {
                            this.render()
                        })
                    }
                },
                {
                    Icon: TrashAppIcon,
                    label: 'Удалить блок',
                    confirmation: {
                        Icon: TrashAppIcon,
                        label: 'Точно удалить?',
                        isDanger: true,
                        shouldClose: true,
                        onActivate: () => this.actions.remove()
                    }
                }
            ]

            const blockOptions: Record<string, Option[]> = {
                heading: [
                    {
                        Icon: TextAppIcon,
                        label: 'Сделать текстом',
                        shouldClose: true,
                        onActivate: () => this.actions.toParagraph()
                    }
                ],
                title: [
                    {
                        Icon: TextAppIcon,
                        label: 'Сделать текстом',
                        shouldClose: true,
                        onActivate: () => this.actions.toParagraph()
                    }
                ],
                paragraph: [
                    {
                        Icon: HeaderAppIcon,
                        label: 'Сделать заголовком',
                        shouldClose: true,
                        onActivate: () => this.actions.toHeading()
                    }
                ],
                list: [
                    {
                        Icon: HeaderAppIcon,
                        label: 'Обычный',
                        isActive: isUnordered,
                        onActivate: () => {
                            this.actions.setListStyle('unordered')
                            this.render()
                        }
                    },
                    {
                        Icon: HeaderAppIcon,
                        label: 'Нумерованный',
                        isActive: isOrdered,
                        onActivate: () => {
                            this.actions.setListStyle('ordered')
                            this.render()
                        }
                    }
                ]
            }

            return (blockOptions[this.block.name] ?? []).concat(
                blockOptions[this.block.name]?.length ? [{ isSeparator: true }] : [],
                !isTitle ? feedOptions : [],
                editOptions
            )
        }
    }
}

const CreateMenu = ({
    options,
    isOpen,
    onOpenChange
}: {
    options: Option[]
    isOpen: boolean
    onOpenChange: (value: boolean) => void
}) => {
    const [search, setSearch] = useState('')
    const [replacedOptions, setReplacedOptions] = useState<Map<number, Option>>(new Map())

    const getCurrentOptions = useCallback(() => {
        return options.map((option, index) => {
            return replacedOptions.has(index) ? replacedOptions.get(index)! : option
        })
    }, [options, replacedOptions])

    const renderOptions = useMemo(() => {
        return getCurrentOptions().filter(
            (option) =>
                !('label' in option) || option.label.toLowerCase().includes(search.toLowerCase())
        )
    }, [getCurrentOptions, search])

    const handleClick = (option: Option, index: number) => {
        if ('confirmation' in option) {
            setReplacedOptions((prev) => {
                const newMap = new Map(prev)
                newMap.set(index, option.confirmation)
                return newMap
            })
        } else if ('onActivate' in option) {
            if (option.shouldClose) {
                onOpenChange(!isOpen)
            }

            option.onActivate()
            setReplacedOptions((prev) => {
                const newMap = new Map(prev)
                newMap.delete(index)
                return newMap
            })
        }
    }

    return (
        <DropdownMenu
            modal={false}
            open={isOpen}
            onOpenChange={(value) => {
                setSearch('')
                setReplacedOptions(new Map())
                onOpenChange(value)
            }}>
            <DropdownMenuTrigger asChild>
                <Button
                    variant={'ghost'}
                    size={'icon-sm'}>
                    <PlusAppIcon size={20} />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='start'>
                <div className='relative mb-1'>
                    <Input
                        autoFocus
                        placeholder='Поиск'
                        className='pl-9 font-geist-sans'
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <SearchAppIcon className='pointer-events-none absolute left-2 top-1/2 h-5 w-5 -translate-y-1/2 opacity-50' />
                </div>
                <ScrollArea
                    type='always'
                    className='flex max-h-[calc(2.45rem*5)] flex-col overflow-y-auto'>
                    <div className='flex flex-col gap-1'>
                        {renderOptions.length === 0 && (
                            <div className='py-2 text-center text-sm'>Нет инструментов</div>
                        )}
                        {renderOptions.length > 0 &&
                            renderOptions.map((option, index) => {
                                return 'isSeparator' in option ? (
                                    <DropdownMenuSeparator key={index} />
                                ) : (
                                    <DropdownMenuItem
                                        variant={
                                            option.isActive
                                                ? 'active'
                                                : option.isDanger
                                                  ? 'destructive'
                                                  : 'default'
                                        }
                                        key={option.label}
                                        onSelect={(e) => {
                                            e.preventDefault()
                                            handleClick(option, index)
                                        }}>
                                        {option.Icon && <option.Icon />}
                                        {option.label}
                                    </DropdownMenuItem>
                                )
                            })}
                    </div>
                </ScrollArea>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

const EditMenu = ({
    options,
    isOpen,
    onOpenChange
}: {
    options: Option[]
    isOpen: boolean
    onOpenChange: (value: boolean) => void
}) => {
    const [replacedOptions, setReplacedOptions] = useState<Map<number, Option>>(new Map())

    const getCurrentOptions = () => {
        return options.map((option, index) => {
            return replacedOptions.has(index) ? replacedOptions.get(index)! : option
        })
    }

    const handleClick = (option: Option, index: number) => {
        if ('confirmation' in option) {
            setReplacedOptions((prev) => {
                const newMap = new Map(prev)
                newMap.set(index, option.confirmation)
                return newMap
            })
        } else if ('onActivate' in option) {
            if (option.shouldClose) {
                onOpenChange(!isOpen)
            }
            option.onActivate()
            setReplacedOptions((prev) => {
                const newMap = new Map(prev)
                newMap.delete(index)
                return newMap
            })
        }
    }

    return (
        <DropdownMenu
            open={isOpen}
            onOpenChange={(value) => {
                onOpenChange(value)
                setReplacedOptions(new Map())
            }}>
            <DropdownMenuTrigger asChild>
                <Button
                    variant={'ghost'}
                    size={'icon-sm'}>
                    <EditAppIcon size={20} />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align='start'
                className='min-w-52'>
                {getCurrentOptions().map((option, index) => {
                    return 'isSeparator' in option ? (
                        <DropdownMenuSeparator key={index} />
                    ) : (
                        <DropdownMenuItem
                            variant={
                                option.isActive
                                    ? 'active'
                                    : option.isDanger
                                      ? 'destructive'
                                      : 'default'
                            }
                            key={option.label}
                            onSelect={(e) => {
                                e.preventDefault()
                                handleClick(option, index)
                            }}>
                            {option.Icon && <option.Icon />}
                            {option.label}
                        </DropdownMenuItem>
                    )
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

CreateMenu.displayName = 'CreateMenu'
EditMenu.displayName = 'EditMenu'

type BaseOption = {
    Icon: LucideIcon
    label: string
    shouldClose?: boolean
    isActive?: boolean
    isDanger?: boolean
}

type Option =
    | (BaseOption & { onActivate: () => void })
    | (BaseOption & { confirmation: Option })
    | { isSeparator: true }
