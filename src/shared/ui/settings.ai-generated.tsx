import type { LucideProps } from 'lucide-react'
import Link from 'next/link'
import { SliderRightAppIcon, UndoAppIcon } from '@/shared/icons'
import { Container, ContainerPadding } from '@/shared/ui/box'
import { Button } from '@/shared/ui/button'
import { cn } from '@/shared/utils/common.utils'

type AiSettingsPageFrameProps = {
    title: string
    subtitle?: string
    backHref?: string
    action?: React.ReactNode
    children: React.ReactNode
}

export const AiSettingsPageFrame = ({
    title,
    subtitle,
    backHref,
    action,
    children
}: AiSettingsPageFrameProps) => {
    return (
        <Container className='overflow-hidden'>
            <ContainerPadding
                isHeader
                className='relative bg-gradient-to-r from-secondary/50 via-secondary/20 to-transparent'>
                {backHref && (
                    <Button
                        asChild
                        className='rounded-full'
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
                    <h2 className='truncate text-lg font-semibold sm:text-xl'>{title}</h2>
                    {subtitle && (
                        <p className='truncate text-xs text-muted-foreground sm:text-sm'>
                            {subtitle}
                        </p>
                    )}
                </div>

                {action && <div className='ml-auto shrink-0'>{action}</div>}
            </ContainerPadding>

            {children}
        </Container>
    )
}

type AiSettingsSectionProps = {
    title?: string
    description?: string
    danger?: boolean
    className?: string
    children: React.ReactNode
}

export const AiSettingsSection = ({
    title,
    description,
    danger,
    className,
    children
}: AiSettingsSectionProps) => {
    return (
        <ContainerPadding className={cn('space-y-3', className)}>
            {(title || description) && (
                <div className='space-y-1'>
                    {title && (
                        <h3 className={cn('text-base font-medium', danger && 'text-destructive')}>
                            {title}
                        </h3>
                    )}
                    {description && <p className='text-sm text-muted-foreground'>{description}</p>}
                </div>
            )}

            {children}
        </ContainerPadding>
    )
}

type AiSettingsFieldProps = {
    label: string
    description?: string
    children: React.ReactNode
}

export const AiSettingsField = ({ label, description, children }: AiSettingsFieldProps) => {
    return (
        <div className='space-y-2'>
            <p className='text-sm font-medium'>{label}</p>
            {children}
            {description && <p className='text-xs text-muted-foreground'>{description}</p>}
        </div>
    )
}

export const AiSettingsList = ({ children }: { children: React.ReactNode }) => {
    return <div className='divide-y divide-border/60'>{children}</div>
}

type AiSettingsNavItemProps = {
    href: string
    label: string
    description: string
    Icon: React.ComponentType<LucideProps>
}

export const AiSettingsNavItem = ({ href, label, description, Icon }: AiSettingsNavItemProps) => {
    return (
        <Link
            href={href}
            className='group flex items-center gap-3 px-3 py-3 transition-colors hover:bg-secondary/40 md:px-4'>
            <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border bg-background text-muted-foreground transition-colors group-hover:text-foreground'>
                <Icon size={18} />
            </div>

            <div className='min-w-0'>
                <p className='truncate text-sm font-medium sm:text-base'>{label}</p>
                <p className='truncate text-xs text-muted-foreground sm:text-sm'>{description}</p>
            </div>

            <SliderRightAppIcon
                size={16}
                className='ml-auto shrink-0 text-muted-foreground transition-colors group-hover:text-foreground'
            />
        </Link>
    )
}
