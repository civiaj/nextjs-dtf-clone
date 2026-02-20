import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { Spinner } from '@/shared/ui/loading-indicator'
import { cn } from '@/shared/utils/common.utils'

const buttonVariants = cva(
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-70 whitespace-nowrap transition-colors duration-100 relative font-medium flex items-center justify-center overflow-hidden',
    {
        variants: {
            variant: {
                base: 'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 active:bg-primary/80',
                'base-light':
                    'bg-primary/50 text-primary-foreground shadow-sm hover:bg-primary/90 active:bg-primary/80',
                secondary:
                    'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary-hover active:bg-secondary-hover/80',
                active: 'bg-active text-active-foreground shadow-sm hover:bg-active/90 active:bg-active/80',
                destructive:
                    'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 active:bg-destructive/80',
                ghost: 'hover:bg-accent hover:text-accent-foreground active:bg-accent/50',
                outline:
                    'border border-border hover:bg-accent hover:text-accent-foreground active:bg-accent/50',
                blue: 'bg-blue-500 text-sm text-primary-foreground hover:bg-blue-400 md:text-base',
                'active-light':
                    'bg-active/10 text-foreground shadow-sm hover:bg-active/20 active:bg-active/30 border border-active/50',
                clean: 'bg-transparent text-primary hover:text-primary/80 active:text-primary/60',
                'clean-active':
                    'bg-transparent text-active hover:text-active/80 active:text-active/50'
            },
            size: {
                lg: 'h-8 sm:h-9 px-6 py-2 text-base sm:text-lg',
                base: 'h-8 sm:h-9 px-4 py-2 text-sm sm:text-base ',
                md: 'h-7 sm:h-8 px-3 py-1 text-sm sm:text-base ',
                sm: 'h-6 sm:h-7 px-2 py-1 text-xs sm:text-sm',
                auto: 'h-auto w-auto text-sm sm:text-base',
                'icon-lg': 'h-9 w-9 sm:h-10 sm:w-10 text-base sm:text-lg',
                'icon-base': 'h-8 w-8 sm:h-9 sm:w-9 text-sm sm:text-base',
                'icon-md': 'h-7 w-7 sm:h-8 sm:w-8 text-sm sm:text-base',
                'icon-sm': 'h-6 w-6 sm:h-7 sm:w-7 text-xs sm:text-sm'
            },
            rounedness: {
                base: 'rounded-xl',
                full: 'rounded-full'
            },
            padding: {
                tight: 'px-0 py-0 sm:px-0 sm:py-0 h-auto sm:h-auto'
            }
        },
        defaultVariants: { variant: 'base', size: 'base', rounedness: 'base' }
    }
)

const spinnerSizes: Record<NonNullable<VariantProps<typeof buttonVariants>['size']>, string> = {
    lg: 'w-4 h-4 border-[3px]',
    base: 'w-4 h-4 border-[3px]',
    md: 'w-3 h-3 border-[2px]',
    sm: 'w-3 h-3 border-[2px]',
    auto: 'w-auto h-auto',
    'icon-lg': 'w-4 h-4 border-[3px]',
    'icon-base': 'w-4 h-4 border-[3px]',
    'icon-md': 'w-3 h-3 border-[2px]',
    'icon-sm': 'w-3 h-3 border-[2px]'
}

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean
    isLoading?: boolean
    isActive?: boolean
    containerClassname?: string
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className,
            containerClassname,
            padding,
            variant,
            rounedness,
            size = 'base',
            asChild = false,
            isLoading,
            children,
            isActive,
            ...props
        },
        ref
    ) => {
        const Component = asChild ? Slot : 'button'
        const isDisabled = asChild ? undefined : isLoading || props.disabled
        const buttonClassname = cn(
            buttonVariants({ size, variant, rounedness, padding }),
            {
                'pointer-events-none': isLoading,
                'text-active hover:text-active': isActive
            },
            className
        )

        return (
            <Component
                ref={ref}
                disabled={asChild ? undefined : isDisabled}
                aria-disabled={asChild ? undefined : isDisabled}
                className={buttonClassname}
                {...props}>
                <div className={cn('flex items-center justify-center gap-2', containerClassname)}>
                    <span
                        className={cn(
                            'flex items-center justify-center gap-2',
                            { ['opacity-0']: isLoading },
                            containerClassname
                        )}>
                        {children}
                    </span>
                    {isLoading && (
                        <span className='absolute inset-0 flex items-center justify-center opacity-100'>
                            <Spinner className={spinnerSizes[size!]} />
                        </span>
                    )}
                </div>
            </Component>
        )
    }
)
Button.displayName = 'Button'

export type TButtonVariants = VariantProps<typeof buttonVariants>['variant']
export { Button, buttonVariants }
