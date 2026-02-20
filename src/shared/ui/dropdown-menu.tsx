'use client'

import * as React from 'react'
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'
import { ChevronRightIcon, DotFilledIcon, CheckIcon } from '@radix-ui/react-icons'
import { LucideProps } from 'lucide-react'
import { useMediaQuery } from '@/shared/hooks/use-media-query'
import { FilterAppIcon } from '@/shared/icons'
import { Button } from '@/shared/ui/button'
import { cn } from '@/shared/utils/common.utils'
import { mergeRefs } from '@/shared/utils/component.utils'

const DropdownMenu = DropdownMenuPrimitive.Root

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger

const DropdownMenuGroup = DropdownMenuPrimitive.Group

const DropdownMenuPortal = DropdownMenuPrimitive.Portal

const DropdownMenuSub = DropdownMenuPrimitive.Sub

const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup

const DropdownMenuSubTrigger = React.forwardRef<
    React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
        inset?: boolean
    }
>(({ className, inset, children, ...props }, ref) => (
    <DropdownMenuPrimitive.SubTrigger
        ref={ref}
        className={cn(
            'flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent',
            inset && 'pl-8',
            className
        )}
        {...props}>
        {children}
        <ChevronRightIcon className='ml-auto h-4 w-4' />
    </DropdownMenuPrimitive.SubTrigger>
))
DropdownMenuSubTrigger.displayName = DropdownMenuPrimitive.SubTrigger.displayName

const DropdownMenuSubContent = React.forwardRef<
    React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
    <DropdownMenuPrimitive.SubContent
        ref={ref}
        className={cn(
            'z-50 min-w-[8rem] overflow-hidden rounded-md border bg-card p-1 text-card-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
            className
        )}
        {...props}
    />
))
DropdownMenuSubContent.displayName = DropdownMenuPrimitive.SubContent.displayName

const DropdownMenuContent = React.forwardRef<
    React.ElementRef<typeof DropdownMenuPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content> & {
        onOpenAutoFocus?: (e: Event) => void
    }
>(({ className, ...props }, ref) => {
    return (
        <DropdownMenuPrimitive.Portal>
            <AccessibleDropdown
                onCloseAutoFocus={(e) => e.preventDefault()}
                className={cn('flex cursor-pointer flex-col gap-1', className)}
                {...props}
                ref={ref}
            />
        </DropdownMenuPrimitive.Portal>
    )
})
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName

const AccessibleDropdown = React.forwardRef<
    React.ElementRef<typeof DropdownMenuPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => {
    const accessibleRef = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
        let activeIdx = -1

        let isKeyboardNavigation = false
        const dropdown = accessibleRef.current
        if (!dropdown) return

        const input = dropdown.querySelector('input')
        const updateNode = (
            node: Element,
            action: 'reset' | 'highlight',
            scroll: boolean = true
        ) => {
            if (!node) return
            switch (action) {
                case 'reset': {
                    node.removeAttribute('data-highlighted')
                    node.setAttribute('tabindex', '-1')
                    break
                }
                case 'highlight': {
                    node.setAttribute('data-highlighted', '')
                    node.setAttribute('tabindex', '0')
                    if (scroll) {
                        node.scrollIntoView({ behavior: 'smooth', block: 'center' })
                    }
                }
            }
        }

        const handleInputKeyDown = (e: KeyboardEvent) => {
            const target = document.querySelector('#accessible-dropdown-menu')

            if (target) {
                isKeyboardNavigation = true

                // 'Slash' - по умолчанию в EditorJs создает текстовую ноду в DOM и получаются странные баги. Полное обьяснение ниже!
                if (['Tab', 'ArrowUp', 'ArrowDown', 'Enter', 'Slash'].includes(e.code)) {
                    e.preventDefault()
                    e.stopPropagation()

                    requestAnimationFrame(() => {
                        const options = dropdown.querySelectorAll('div[role=menuitem]')
                        options.forEach((option) => updateNode(option, 'reset'))
                        if (activeIdx === -1) {
                            activeIdx = 0
                        } else {
                            switch (e.key) {
                                case 'Tab':
                                case 'ArrowDown': {
                                    activeIdx = activeIdx < options.length - 1 ? activeIdx + 1 : 0
                                    break
                                }
                                case 'ArrowUp': {
                                    activeIdx = activeIdx === 0 ? options.length - 1 : activeIdx - 1
                                    break
                                }
                                case 'Enter': {
                                    const node = options[activeIdx] as HTMLElement
                                    node?.dispatchEvent(
                                        new PointerEvent('click', { bubbles: true })
                                    )
                                }
                            }
                        }
                        updateNode(options[activeIdx], 'highlight')
                    })
                } else {
                    activeIdx = -1
                    requestAnimationFrame(() => {
                        const options = dropdown.querySelectorAll('div[role=menuitem]')
                        options.forEach((option) => updateNode(option, 'reset'))
                        updateNode(options[activeIdx], 'highlight')
                    })
                }
                input?.focus()
            }
        }
        const handleMouseOver = (e: MouseEvent) => {
            if (isKeyboardNavigation) return
            const options = dropdown.querySelectorAll('div[role=menuitem]')
            options.forEach((option, index) => {
                if (option.contains(e.target as Node)) {
                    activeIdx = index
                    updateNode(option, 'highlight', false)
                } else {
                    updateNode(option, 'reset')
                }
            })
        }
        const handleMouseMove = () => {
            isKeyboardNavigation = false
        }
        const handlePointerLeave = () => {
            activeIdx = -1
            const options = dropdown.querySelectorAll('div[role=menuitem]')
            options.forEach((option) => updateNode(option, 'reset'))
        }

        // Повесил на window, чтобы перехватывать стрелки у EditorJS.
        // сделать свою реализацию dropdown, которая будет рендерится внутри this.block.holder или вешать на window.

        window.addEventListener('keydown', handleInputKeyDown, { capture: true })
        dropdown.addEventListener('mouseover', handleMouseOver)
        dropdown.addEventListener('mousemove', handleMouseMove)
        dropdown.addEventListener('pointerleave', handlePointerLeave)

        return () => {
            window.removeEventListener('keydown', handleInputKeyDown, { capture: true })
            dropdown.removeEventListener('mouseover', handleMouseOver)
            dropdown.removeEventListener('mousemove', handleMouseMove)
            dropdown.removeEventListener('pointerleave', handlePointerLeave)
        }
    }, [])

    return (
        <DropdownMenuPrimitive.Content
            ref={mergeRefs(ref, accessibleRef)}
            id='accessible-dropdown-menu'
            onMouseDown={(e) => e.preventDefault()}
            onFocus={(e) => e.preventDefault()}
            sideOffset={sideOffset}
            className={cn(
                'z-50 min-w-[8rem] overflow-hidden rounded-xl border bg-card p-1 text-card-foreground shadow-md',
                '',
                className
            )}
            {...props}
        />
    )
})

AccessibleDropdown.displayName = 'AccessibleDropdown'

const DropdownMenuItem = React.forwardRef<
    React.ElementRef<typeof DropdownMenuPrimitive.Item>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
        inset?: boolean
        isActive?: boolean
        isDanger?: boolean
    }
>(({ className, isActive, isDanger, inset, ...props }, ref) => {
    return (
        <DropdownMenuPrimitive.Item
            ref={ref}
            onPointerLeave={(e) => e.preventDefault()}
            onPointerMove={(e) => e.preventDefault()}
            className={cn(
                'relative flex cursor-pointer select-none items-center gap-3 rounded-md px-2 py-1 text-sm font-medium outline-none transition-colors duration-100 data-[disabled]:pointer-events-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:opacity-50',
                inset && 'pl-8',
                {
                    ['bg-destructive font-medium text-background data-[highlighted]:bg-red-600 data-[highlighted]:text-background']:
                        isDanger,
                    ['bg-active/5 font-medium text-active data-[highlighted]:text-active']: isActive
                },
                className
            )}
            {...props}
        />
    )
})
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName

const DropdownMenuCheckboxItem = React.forwardRef<
    React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
    <DropdownMenuPrimitive.CheckboxItem
        ref={ref}
        className={cn(
            'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
            className
        )}
        checked={checked}
        {...props}>
        <span className='absolute left-2 flex h-3.5 w-3.5 items-center justify-center'>
            <DropdownMenuPrimitive.ItemIndicator>
                <CheckIcon className='h-4 w-4' />
            </DropdownMenuPrimitive.ItemIndicator>
        </span>
        {children}
    </DropdownMenuPrimitive.CheckboxItem>
))
DropdownMenuCheckboxItem.displayName = DropdownMenuPrimitive.CheckboxItem.displayName

const DropdownMenuRadioItem = React.forwardRef<
    React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
    <DropdownMenuPrimitive.RadioItem
        ref={ref}
        className={cn(
            'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
            className
        )}
        {...props}>
        <span className='absolute left-2 flex h-3.5 w-3.5 items-center justify-center'>
            <DropdownMenuPrimitive.ItemIndicator>
                <DotFilledIcon className='h-4 w-4 fill-current' />
            </DropdownMenuPrimitive.ItemIndicator>
        </span>
        {children}
    </DropdownMenuPrimitive.RadioItem>
))
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName

const DropdownMenuLabel = React.forwardRef<
    React.ElementRef<typeof DropdownMenuPrimitive.Label>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
        inset?: boolean
    }
>(({ className, inset, ...props }, ref) => (
    <DropdownMenuPrimitive.Label
        ref={ref}
        className={cn('px-2 py-1.5 text-sm font-semibold', inset && 'pl-8', className)}
        {...props}
    />
))
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName

const DropdownMenuSeparator = React.forwardRef<
    React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
    <DropdownMenuPrimitive.Separator
        ref={ref}
        className={cn('-mx-1 my-1 h-px bg-muted', className)}
        {...props}
    />
))
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName

const DropdownMenuShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
    return (
        <span
            className={cn('ml-auto text-xs tracking-widest opacity-60', className)}
            {...props}
        />
    )
}
DropdownMenuShortcut.displayName = 'DropdownMenuShortcut'

const DropdownMenuWithActive = <T,>({
    options,
    children,
    align = 'start',
    onSelect,
    isOpen,
    onOpenChange
}: DropdownMenuWithActiveProps<T>) => {
    const [activeOption, setActiveOption] = React.useState<T | null>(null)
    const [internalIsOpen, setInternalIsOpen] = React.useState(false)
    const isControlled = isOpen !== undefined
    const actualIsOpen = isControlled ? isOpen : internalIsOpen

    const displayedOptions = options.flatMap((option) => {
        if (activeOption === option.value && option.active) {
            return option.active
        }
        return option
    })

    const handleModalOpen = (value: boolean) => {
        if (isControlled) {
            onOpenChange?.(value ?? !isOpen)
        } else {
            setInternalIsOpen((p) => value ?? !p)
        }
        setActiveOption(null)
    }

    const handleSelect = (option: TDropDownOption<T>) => {
        if (option.active) {
            setActiveOption(option.value)
            return
        }

        onSelect(option)

        if (!isControlled) {
            handleModalOpen(false)
        }
    }

    return (
        <DropdownMenu
            modal={false}
            onOpenChange={handleModalOpen}
            open={actualIsOpen}>
            {children}
            <DropdownMenuContent align={align}>
                {displayedOptions.map((option) => (
                    <DropdownMenuItem
                        key={option.label}
                        isActive={option?.style === 'active'}
                        isDanger={option?.style === 'danger'}
                        className='flex items-center gap-3 text-sm'
                        onSelect={(e) => {
                            e.preventDefault()
                            handleSelect(option)
                        }}>
                        {option.Icon && <option.Icon size={20} />}
                        {option.label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

const DropDownFilter = <T,>({
    align,
    options,
    onClick,
    filter,
    isResponsive = true,
    buttonClassname,
    buttonContainerClassname
}: {
    filter: T
    options: TDropDownOption<T>[]
    align?: 'center' | 'end' | 'start'
    onClick: (option: TDropDownOption<T>) => void
    isResponsive?: boolean
    buttonContainerClassname?: string
    buttonClassname?: string
}) => {
    const [isOpen, setIsOpen] = React.useState(false)
    const label = options.find((option) => option.value === filter)?.label
    const isMobile = useMediaQuery('(max-width: 640px)')

    const Trigger =
        isMobile && isResponsive ? (
            <Button
                containerClassname={buttonContainerClassname}
                className={buttonClassname}
                rounedness={'full'}
                variant='ghost'
                size={'icon-md'}>
                <FilterAppIcon size={20} />
            </Button>
        ) : (
            <Button
                containerClassname={buttonContainerClassname}
                className={buttonClassname}
                variant='outline'
                size={'md'}>
                {label}
                <FilterAppIcon size={16} />
            </Button>
        )

    return (
        <DropdownMenu
            modal={false}
            onOpenChange={() => setIsOpen((p) => !p)}
            open={isOpen}>
            <DropdownMenuTrigger asChild>{Trigger}</DropdownMenuTrigger>
            <DropdownMenuContent align={align}>
                {options.map((option) => (
                    <DropdownMenuItem
                        key={option.label}
                        isActive={option?.style === 'active' || option.value === filter}
                        isDanger={option?.style === 'danger'}
                        className='flex items-center gap-3'
                        onClick={() => onClick(option)}>
                        {option.Icon && <option.Icon size={20} />}
                        <span>{option.label}</span>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export {
    DropDownFilter,
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
    DropdownMenuWithActive
}

export type DropdownMenuWithActiveProps<T> = {
    options: TDropDownOption<T>[]
    children: React.ReactNode
    align?: 'center' | 'end' | 'start'
    onSelect: (option: TDropDownOption<T>) => void
    isOpen?: boolean
    onOpenChange?: (value: boolean) => void
}

export type TDropDownOption<T> = {
    label: string
    Icon?: React.ComponentType<LucideProps>
    value: T
    style?: 'danger' | 'active'
    active?: TDropDownOption<T>[]
}
