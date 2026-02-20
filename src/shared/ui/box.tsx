import { forwardRef } from 'react'
import { Text } from '@/shared/ui/text'
import { cn } from '@/shared/utils/common.utils'

export const Container = forwardRef<
    HTMLDivElement,
    {
        children?: React.ReactNode
        withAnimation?: boolean
        withBottom?: boolean
    } & React.HTMLAttributes<HTMLDivElement>
>(({ children, className, withAnimation, withBottom = true, ...otherProps }, ref) => {
    return (
        <div
            data-card
            ref={ref}
            className={cn(
                'rounded-nonde mb-2 w-full bg-card text-card-foreground md:mb-4 md:rounded-xl',
                { ['animate-in fade-in-0']: withAnimation, ['pb-4 md:pb-6']: withBottom },
                className
            )}
            {...otherProps}>
            {children}
        </div>
    )
})

Container.displayName = 'Container'

export const ContainerPadding = ({
    children,
    className,
    withBottom,
    withTop = true,
    isHeader,
    smallMargin,
    ...otherProps
}: {
    children: React.ReactNode
    withBottom?: boolean
    withTop?: boolean
    isHeader?: boolean
    smallMargin?: boolean
} & React.HTMLAttributes<HTMLDivElement>) => {
    return (
        <div
            className={cn(
                'shrink-0 px-3 pt-3 sm:px-6 sm:pt-6',
                {
                    ['pb-3 sm:pb-6']: withBottom,
                    ['pt-0 sm:pt-0']: !withTop,
                    ['mt-2 pt-0 sm:mt-4 sm:pt-0']: smallMargin,
                    ['flex h-16 items-center justify-start gap-1 border-b border-border py-0 md:py-0']:
                        isHeader
                },
                className
            )}
            {...otherProps}>
            {children}
        </div>
    )
}

export const MessageContainer = ({
    children,
    isContainered = true
}: {
    children: React.ReactNode
    isContainered?: boolean
}) => {
    if (isContainered) {
        return (
            <Container>
                <ContainerPadding className='flex min-h-52 flex-col items-center justify-center'>
                    <Text
                        className='font-medium'
                        as='p'>
                        {children}
                    </Text>
                </ContainerPadding>
            </Container>
        )
    }

    return (
        <div className='flex min-h-52 items-center justify-center'>
            <Text
                as='p'
                className='font-medium'>
                {children}
            </Text>
        </div>
    )
}
