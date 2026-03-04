import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
    type FocusEvent as ReactFocusEvent,
    type KeyboardEvent as ReactKeyboardEvent
} from 'react'
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
                if (this.state.openId !== this.block.id) {
                    this.state.setOpenId(this.block.id)
                }
            } else if (this.state.openId === this.block.id) {
                this.state.setOpenId(null)
            }
            this.render()
        }

        this.root.render(
            isEmpty ? (
                <BlockMenu
                    key={this.block.id}
                    options={this.getCreateOptions()}
                    onOpenChange={onOpenChange}
                    isOpen={isOpen}
                    withInput
                    triggerIcon={PlusAppIcon}
                />
            ) : (
                <BlockMenu
                    key={this.block.id}
                    options={this.getEditOptions()}
                    onOpenChange={onOpenChange}
                    isOpen={isOpen}
                    triggerIcon={EditAppIcon}
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
                onActivate: () => {
                    this.destroy()
                    this.actions.create('paragraph', true)
                }
            },
            {
                Icon: HeaderAppIcon,
                label: 'Заголовок',
                shouldClose: true,
                onActivate: () => {
                    this.destroy()
                    this.actions.create('heading', true)
                }
            },
            {
                Icon: ListAppIcon,
                label: 'Список',
                shouldClose: true,
                onActivate: () => {
                    this.destroy()
                    this.actions.create('list', true)
                }
            },
            {
                Icon: MediaAppIcon,
                label: 'Фото или видео',
                shouldClose: true,
                onActivate: () => {
                    this.destroy()
                    this.actions.create('media', false)
                }
            },
            {
                Icon: LinkAppIcon,
                label: 'Ссылка',
                shouldClose: true,
                onActivate: () => {
                    this.destroy()
                    this.actions.create('link', true)
                }
            },
            {
                Icon: QuoteAppIcon,
                label: 'Цитата',
                shouldClose: true,
                onActivate: () => {
                    this.destroy()
                    this.actions.create('quote', true)
                }
            },
            {
                Icon: SeparatorAppIcon,
                label: 'Разделитель',
                shouldClose: true,
                onActivate: () => {
                    this.destroy()
                    this.actions.create('separator', false)
                }
            },
            {
                Icon: CodeAppIcon,
                label: 'Код',
                shouldClose: true,
                onActivate: () => {
                    this.destroy()
                    this.actions.create('code', true)
                }
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
                    options: [
                        {
                            Icon: TrashAppIcon,
                            label: 'Точно удалить?',
                            isDanger: true,
                            shouldClose: true,
                            onActivate: () => {
                                this.destroy()
                                this.actions.remove()
                            }
                        }
                    ]
                }
            ]

            const blockOptions: Record<string, Option[]> = {
                heading: [
                    {
                        Icon: TextAppIcon,
                        label: 'Сделать текстом',
                        shouldClose: true,
                        onActivate: () => {
                            this.destroy()
                            this.actions.toParagraph()
                        }
                    }
                ],
                title: [
                    {
                        Icon: TextAppIcon,
                        label: 'Сделать текстом',
                        shouldClose: true,
                        onActivate: () => {
                            this.destroy()
                            this.actions.toParagraph()
                        }
                    }
                ],
                paragraph: [
                    {
                        Icon: HeaderAppIcon,
                        label: 'Сделать заголовком',
                        shouldClose: true,
                        onActivate: () => {
                            this.destroy()
                            this.actions.toHeading()
                        }
                    }
                ],
                list: [
                    {
                        Icon: HeaderAppIcon,
                        label: 'Обычный',
                        isActive: isUnordered,
                        shouldClose: false,
                        onActivate: () => {
                            this.actions.setListStyle('unordered')
                            this.render()
                        }
                    },
                    {
                        Icon: HeaderAppIcon,
                        label: 'Нумерованный',
                        isActive: isOrdered,
                        shouldClose: false,
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

type MenuProps = {
    options: Option[]
    isOpen: boolean
    onOpenChange: (value: boolean) => void
    optionsBeforeScroll?: number
    triggerIcon: LucideIcon
    withInput?: boolean
}

type BaseOption = {
    Icon: LucideIcon
    label: string
    shouldClose?: boolean
    isActive?: boolean
    isDanger?: boolean
    options?: Option[]
    onActivate?: () => void
}

type Option = BaseOption | { isSeparator: true }

type VisibleMenuEntry =
    | {
          kind: 'separator'
          key: string
      }
    | {
          kind: 'option'
          key: string
          option: BaseOption
          sourceIndex: number
          activeIndex: number
      }

const BlockMenu = ({
    options,
    isOpen,
    onOpenChange,
    triggerIcon: TriggerIcon,
    withInput = false,
    optionsBeforeScroll = 7
}: MenuProps) => {
    const [searchInputValue, setSearchInputValue] = useState('')
    const [activeIndex, setActiveIndex] = useState<number | null>(null)
    const { items, replaceAt, reset } = useInlineReplaceMenu(options)
    const searchInputRef = useRef<HTMLInputElement>(null)
    const optionRefs = useRef<Array<HTMLElement | null>>([])
    const dropdownOptionsContainerRef = useRef<HTMLDivElement>(null)

    const visibleEntries = useMemo<VisibleMenuEntry[]>(() => {
        const query = searchInputValue.trim().toLowerCase()
        const entries: VisibleMenuEntry[] = []
        let nextActiveIndex = 0

        for (let sourceIndex = 0; sourceIndex < items.length; sourceIndex += 1) {
            const option = items[sourceIndex]

            if (isSeparatorOption(option)) {
                entries.push({
                    kind: 'separator',
                    key: `separator-${sourceIndex}`
                })
                continue
            }

            if (query && !option.label.toLowerCase().includes(query)) {
                continue
            }

            entries.push({
                kind: 'option',
                key: `${option.label}-${sourceIndex}`,
                option,
                sourceIndex,
                activeIndex: nextActiveIndex
            })

            nextActiveIndex += 1
        }

        return entries
    }, [items, searchInputValue])

    const selectableEntries = useMemo(() => visibleEntries.filter(isOptionEntry), [visibleEntries])

    const focusInput = useCallback(() => {
        requestAnimationFrame(() => searchInputRef.current?.focus())
    }, [])

    useEffect(() => {
        if (!withInput || !isOpen) return
        focusInput()
    }, [focusInput, isOpen, withInput])

    useEffect(() => {
        if (!withInput || !isOpen) return

        const input = searchInputRef.current
        if (!input) return
        if (document.activeElement === input) return

        requestAnimationFrame(() => input.focus({ preventScroll: true }))
    }, [isOpen, visibleEntries.length, withInput])

    useEffect(() => {
        if (!isOpen) {
            setActiveIndex(null)
            return
        }

        setActiveIndex((prev) => {
            if (prev === null) {
                return null
            }

            if (selectableEntries.length === 0) {
                return null
            }

            return Math.min(prev, selectableEntries.length - 1)
        })
    }, [isOpen, selectableEntries.length])

    const handleOpenChange = useCallback(
        (value: boolean) => {
            if (!value) {
                setSearchInputValue('')
                setActiveIndex(null)
                reset()
            }

            onOpenChange(value)
        },
        [onOpenChange, reset]
    )

    const handleOptionSelect = useCallback(
        (option: BaseOption, index: number) => {
            if (option.options?.length) {
                replaceAt(index)
                setActiveIndex(null)
                return
            }

            handleOpenChange(!option.shouldClose)
            option.onActivate?.()
        },
        [handleOpenChange, replaceAt]
    )

    const scrollActiveItem = useCallback((index: number | null) => {
        if (index === null) return

        const item = optionRefs.current[index]
        if (!item) return

        item.scrollIntoView({ block: 'nearest' })
    }, [])

    useEffect(() => {
        scrollActiveItem(activeIndex)
    }, [activeIndex, scrollActiveItem])

    const moveActiveIndex = useCallback(
        (delta: -1 | 1) => {
            if (selectableEntries.length === 0) return

            setActiveIndex((prev) => {
                const current = prev ?? (delta === 1 ? -1 : 0)
                return (current + delta + selectableEntries.length) % selectableEntries.length
            })
        },
        [selectableEntries.length]
    )

    const selectActiveItem = useCallback(
        (index: number | null) => {
            if (index === null) return

            const current = selectableEntries[index]
            if (!current) return

            handleOptionSelect(current.option, current.sourceIndex)
        },
        [handleOptionSelect, selectableEntries]
    )

    const handleNavigateKey = useCallback(
        (key: GuardedMenuKey) => {
            if (key === 'ArrowDown') {
                moveActiveIndex(1)
                return
            }

            if (key === 'ArrowUp') {
                moveActiveIndex(-1)
                return
            }

            if (key === 'Enter') {
                selectActiveItem(activeIndex)
                return
            }

            if (key === 'Escape') {
                handleOpenChange(false)
            }
        },
        [activeIndex, handleOpenChange, moveActiveIndex, selectActiveItem]
    )

    const handleItemFocus = useCallback(
        (event: ReactFocusEvent<Element>) => {
            if (!withInput) return

            event.preventDefault()
            const input = searchInputRef.current
            if (!input) return

            requestAnimationFrame(() => input.focus({ preventScroll: true }))
        },
        [withInput]
    )

    useWindowMenuGuard({
        isOpen,
        onGuardedKey: handleNavigateKey
    })

    const handleMenuKeyDown = useCallback(
        (event: ReactKeyboardEvent<Element>) => {
            if (!isGuardedMenuKey(event.key)) return

            event.preventDefault()
            stopReactKeyboardPropagation(event)
            handleNavigateKey(event.key)
        },
        [handleNavigateKey]
    )

    const dropdownOptionsContainerRefCallback = useCallback(
        (node: HTMLDivElement | null) => {
            dropdownOptionsContainerRef.current = node
            getMaxListHeight(node, optionsBeforeScroll)
        },
        [optionsBeforeScroll]
    )

    useEffect(() => {
        getMaxListHeight(dropdownOptionsContainerRef.current, optionsBeforeScroll)
    }, [optionsBeforeScroll, visibleEntries.length])

    return (
        <DropdownMenu
            modal={false}
            open={isOpen}
            onOpenChange={handleOpenChange}>
            <DropdownMenuTrigger asChild>
                <Button
                    variant={'ghost'}
                    size={'icon-sm'}>
                    <TriggerIcon />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align='start'
                onKeyDown={handleMenuKeyDown}>
                {withInput && (
                    <>
                        <div className='relative'>
                            <Input
                                ref={searchInputRef}
                                autoFocus
                                size={13}
                                placeholder='Поиск'
                                className='w-full min-w-0 pl-9 text-sm sm:text-sm'
                                value={searchInputValue}
                                onKeyDown={handleMenuKeyDown}
                                onChange={(event) => {
                                    event.stopPropagation()
                                    event.preventDefault()
                                    setSearchInputValue(event.target.value)
                                }}
                            />
                            <SearchAppIcon className='pointer-events-none absolute left-2 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground' />
                        </div>
                        <DropdownMenuSeparator />
                    </>
                )}

                <ScrollArea type='always'>
                    <div
                        className='flex flex-col gap-1'
                        ref={dropdownOptionsContainerRefCallback}>
                        {visibleEntries.length === 0 && withInput && (
                            <div className='py-2 text-center text-sm'>Нет инструментов</div>
                        )}
                        {visibleEntries.map((entry) => {
                            return entry.kind === 'separator' ? (
                                <DropdownMenuSeparator
                                    key={entry.key}
                                    data-separator
                                    className='shrink-0'
                                />
                            ) : (
                                <DropdownMenuItem
                                    ref={(node) => {
                                        optionRefs.current[entry.activeIndex] = node
                                    }}
                                    key={entry.key}
                                    {...(entry.activeIndex === activeIndex
                                        ? { ['data-highlighted']: '' }
                                        : {})}
                                    tabIndex={entry.activeIndex === activeIndex ? 0 : -1}
                                    data-selectable
                                    variant={
                                        entry.option.isActive
                                            ? 'active'
                                            : entry.option.isDanger
                                              ? 'destructive'
                                              : 'default'
                                    }
                                    onFocus={handleItemFocus}
                                    onPointerMove={(e) => {
                                        e.preventDefault()
                                        setActiveIndex(entry.activeIndex)
                                    }}
                                    onPointerEnter={(e) => e.preventDefault()}
                                    onPointerLeave={(e) => e.preventDefault()}
                                    onSelect={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        handleOptionSelect(entry.option, entry.sourceIndex)
                                    }}>
                                    {entry.option.Icon && <entry.option.Icon />}
                                    {entry.option.label}
                                </DropdownMenuItem>
                            )
                        })}
                    </div>
                </ScrollArea>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

const GUARDED_MENU_KEYS = ['ArrowDown', 'ArrowUp', 'Enter', 'Escape'] as const

type GuardedMenuKey = (typeof GUARDED_MENU_KEYS)[number]

const isSeparatorOption = (option: Option): option is { isSeparator: true } => {
    return 'isSeparator' in option
}

const isBaseOption = (option: Option | undefined): option is BaseOption => {
    return !!option && !isSeparatorOption(option)
}

const isOptionEntry = (
    entry: VisibleMenuEntry
): entry is Extract<VisibleMenuEntry, { kind: 'option' }> => {
    return entry.kind === 'option'
}

const isGuardedMenuKey = (key: string): key is GuardedMenuKey => {
    return GUARDED_MENU_KEYS.includes(key as GuardedMenuKey)
}

const stopNativeKeyboardPropagation = (event: KeyboardEvent) => {
    event.stopPropagation()
    event.stopImmediatePropagation()
}

const stopReactKeyboardPropagation = (event: ReactKeyboardEvent) => {
    event.stopPropagation()
    event.nativeEvent.stopImmediatePropagation()
}

const useWindowMenuGuard = ({
    isOpen,
    onGuardedKey
}: {
    isOpen: boolean
    onGuardedKey: (key: GuardedMenuKey) => void
}) => {
    useEffect(() => {
        if (!isOpen) return

        const guard = (event: KeyboardEvent) => {
            if (!isGuardedMenuKey(event.key)) return

            event.preventDefault()
            stopNativeKeyboardPropagation(event)
            onGuardedKey(event.key)
        }

        window.addEventListener('keydown', guard, true)
        return () => window.removeEventListener('keydown', guard, true)
    }, [isOpen, onGuardedKey])
}

const getMaxListHeight = (node: HTMLDivElement | null, optionsBeforeScroll: number) => {
    if (!node) return

    const items = Array.from(node.children) as HTMLElement[]

    if (!items.length) {
        return
    }

    const firstItem = items[0]
    let selectableCount = 0
    let lastVisibleItem: HTMLElement | null = null

    for (const item of items) {
        if (item.dataset.selectable) {
            selectableCount += 1
        }

        if (selectableCount >= optionsBeforeScroll) {
            lastVisibleItem = item
            break
        }
    }

    if (!lastVisibleItem) {
        return
    }

    const maxHeight = lastVisibleItem.offsetTop + lastVisibleItem.offsetHeight - firstItem.offsetTop
    node.style.maxHeight = `${maxHeight}px`
}

export function useInlineReplaceMenu(root: Option[]) {
    const [history, setHistory] = useState<Option[][]>([])
    const items = history.length ? history[history.length - 1] : root

    const replaceAt = useCallback(
        (index: number) => {
            setHistory((prevHistory) => {
                const currentItems = prevHistory.length ? prevHistory[prevHistory.length - 1] : root
                const parent = currentItems[index]

                if (!isBaseOption(parent) || !parent.options?.length) {
                    return prevHistory
                }

                const nextItems = currentItems.slice()
                nextItems.splice(index, 1, ...parent.options)
                return [...prevHistory, nextItems]
            })
        },
        [root]
    )

    const back = useCallback(() => {
        setHistory((prevHistory) => prevHistory.slice(0, -1))
    }, [])

    const reset = useCallback(() => {
        setHistory([])
    }, [])

    return { items, replaceAt, back, reset, canBack: history.length > 0 }
}
