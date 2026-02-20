import React from 'react'
import { cva } from 'class-variance-authority'
type Props = {
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'p' | 'span'
    size?: 'base' | 'sm' | 'xs'
    children?: React.ReactNode
    className?: string
} & React.HTMLAttributes<HTMLHeadingElement>

export const textStyles = cva('', {
    variants: {
        as: {
            h1: 'text-xl font-semibold tracking-tight outline-none sm:text-2xl',
            h2: 'text-lg font-semibold tracking-tight outline-none sm:text-xl',
            h3: 'text-lg font-medium sm:text-xl',
            h4: 'font-medium text-base',
            h5: 'text-xs font-medium sm:text-sm',
            p: 'text-base',
            span: 'text-base'
        },
        size: {
            base: '',
            sm: 'text-sm',
            xs: 'text-xs'
        }
    },
    defaultVariants: {
        as: 'p',
        size: 'base'
    }
})

export const Text = (props: Props) => {
    const { as = 'p', size, children, className, ...otherProps } = props
    const Heading = ({ ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
        return React.createElement(as, props, children)
    }

    return (
        <Heading
            {...otherProps}
            className={textStyles({ as, size, className })}>
            {children}
        </Heading>
    )
}
