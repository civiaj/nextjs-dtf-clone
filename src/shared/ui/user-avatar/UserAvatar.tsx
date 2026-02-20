import Link from 'next/link'
import { TUser } from '@/shared/types/user.types'
import { AppImage, AppMediaContainer } from '@/shared/ui/media'
import { Text } from '@/shared/ui/text'
import { cn } from '@/shared/utils/common.utils'

const Container = ({ children, className }: { className?: string; children: React.ReactNode }) => {
    return (
        <div className={cn('mr-2 grid grid-cols-[min-content,1fr] items-center gap-2', className)}>
            {children}
        </div>
    )
}

const Avatar = ({
    asChild,
    children,
    size = 'base',
    href,
    avatar,
    avatarColor,
    name,
    className
}: {
    asChild?: boolean
    children?: React.ReactNode
    size?: 'lg' | 'base' | 'sm'
    href?: string
    className?: string
} & Partial<Pick<TUser, 'avatar' | 'avatarColor' | 'name'>>) => {
    let Content: React.ReactNode = children

    if (!asChild) {
        if (avatar) {
            Content = (
                <AppMediaContainer
                    className='h-full w-full'
                    blurDataURL={avatar.blurDataURL}
                    height={avatar.height}
                    width={avatar.width}>
                    <AppImage
                        media={avatar}
                        className='object-cover'
                    />
                </AppMediaContainer>
            )
        } else if (avatarColor && name) {
            Content = (
                <div
                    className='flex h-full w-full items-center justify-center'
                    style={{ backgroundColor: avatarColor.value }}>
                    {name[0]?.toUpperCase()}
                </div>
            )
        }
    }

    Content = (
        <div
            className={cn(
                'flex shrink-0 items-center overflow-hidden rounded-full font-bold',
                {
                    ['h-20 w-20 text-2xl font-bold sm:h-24 sm:w-24 sm:text-4xl']: size === 'lg',
                    ['h-8 w-8 text-sm font-bold sm:h-9 sm:w-9 sm:text-lg']: size === 'base',
                    ['h-5 w-5 text-xs font-medium sm:h-6 sm:w-6 sm:text-sm']: size === 'sm'
                },
                'isolate',
                className
            )}>
            {Content}
        </div>
    )

    if (href) {
        Content = (
            <Link
                className='hover:opacity-70'
                href={href}>
                {Content}
            </Link>
        )
    }

    return Content
}

const Details = ({ children, className }: { children?: React.ReactNode; className?: string }) => {
    return <div className={cn('min-w-0', className)}>{children}</div>
}

const Name = ({
    name,
    href,
    className,
    asChild,
    children
}: {
    href?: string
    name: string
    className?: string
    asChild?: boolean
    children?: React.ReactNode
}) => {
    let Content: React.ReactNode = children

    if (!asChild) {
        Content = (
            <Text
                as='p'
                className={cn('truncate font-medium leading-5', className)}>
                {name}
            </Text>
        )
    }

    if (href) {
        Content = (
            <Link
                href={href}
                className='hover:opacity-70'>
                {Content}
            </Link>
        )
    }

    return Content
}

const Extra = ({
    asChild,
    children,
    description,
    descriptionTitle
}: {
    asChild?: boolean
    children?: React.ReactNode
    description?: string
    descriptionTitle?: string
}) => {
    let Content: React.ReactNode = children

    if (!asChild) {
        Content = (
            <div className='relative flex text-muted-foreground'>
                {description && (
                    <Text
                        title={descriptionTitle}
                        className='truncate text-sm sm:text-sm'
                        as='p'>
                        {description}
                    </Text>
                )}
                {children}
            </div>
        )
    }

    return Content
}

export const UserAvatar = Object.assign(Container, {
    Avatar,
    Details,
    Name,
    Extra
})
