import { LucideProps } from 'lucide-react'
import Link from 'next/link'
import { SliderRightAppIcon, UndoAppIcon } from '@/shared/icons'
import { Container, ContainerPadding } from '@/shared/ui/box'
import { Button } from '@/shared/ui/button'
import { Text } from '@/shared/ui/text'
import { cn } from '@/shared/utils/common.utils'

type TSettingsLayoutProps = {
    title: string
    subtitle?: string
    backHref?: string
    action?: React.ReactNode
    children?: React.ReactNode
    withBottom?: boolean
}

export const SettingsLayout = ({
    title,
    subtitle,
    backHref,
    action,
    children,
    withBottom = true
}: TSettingsLayoutProps) => {
    return (
        <Container withBottom={withBottom}>
            <ContainerPadding isHeader>
                {backHref && (
                    <Button
                        asChild
                        title='Назад'
                        className='mr-2 shrink-0 rounded-full'
                        variant='ghost'
                        size='icon-base'>
                        <Link
                            href={backHref}
                            scroll={false}>
                            <UndoAppIcon size={18} />
                        </Link>
                    </Button>
                )}
                <div className='min-w-0'>
                    <Text
                        as='h2'
                        className='truncate'>
                        {title}
                    </Text>
                    {subtitle && (
                        <Text
                            as='p'
                            size='xs'
                            className='truncate text-muted-foreground'>
                            {subtitle}
                        </Text>
                    )}
                </div>
                {action && <div className='ml-auto shrink-0'>{action}</div>}
            </ContainerPadding>
            {children}
        </Container>
    )
}

type TSettingsSectionProps = {
    title?: string
    description?: string
    className?: string
    children: React.ReactNode
}

export const SettingsSection = ({
    title,
    description,
    className,
    children
}: TSettingsSectionProps) => {
    return (
        <ContainerPadding className={cn('space-y-4', className)}>
            {(title || description) && (
                <div className='space-y-1'>
                    {title && <Text as='h4'>{title}</Text>}
                    {description && (
                        <Text
                            as='p'
                            size='sm'
                            className='text-muted-foreground'>
                            {description}
                        </Text>
                    )}
                </div>
            )}
            {children}
        </ContainerPadding>
    )
}

type TSettingsFieldProps = {
    label: string
    description?: string
    children?: React.ReactNode
}

export const SettingsField = ({ label, description, children }: TSettingsFieldProps) => {
    return (
        <div className='space-y-2'>
            <Text
                as='h4'
                className='mb-0'>
                {label}
            </Text>
            {children}
            {description && (
                <Text
                    as='p'
                    size='xs'
                    className='text-muted-foreground'>
                    {description}
                </Text>
            )}
        </div>
    )
}

type TSettingsLinkCardProps = {
    href: string
    label: string
    description: string
    Icon: React.ComponentType<LucideProps>
}

export const SettingsLinkCard = ({ href, label, description, Icon }: TSettingsLinkCardProps) => {
    return (
        <Link
            href={href}
            className='group flex items-center gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-accent md:px-4'>
            <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border text-muted-foreground transition-colors group-hover:border-active group-hover:text-active'>
                <Icon size={18} />
            </div>

            <div>
                <Text
                    as='h4'
                    className='mb-0'>
                    {label}
                </Text>
                <Text
                    as='p'
                    className='text-muted-foreground'>
                    {description}
                </Text>
            </div>
            <SliderRightAppIcon
                size={16}
                className='ml-auto shrink-0 text-muted-foreground transition-colors group-hover:text-foreground'
            />
        </Link>
    )
}
