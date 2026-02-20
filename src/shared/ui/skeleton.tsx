import { cn } from '@/shared/utils/common.utils'

function Skeleton({
    className,
    children,

    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn('rounded-xl bg-background', className)}
            {...props}>
            {children}
        </div>
    )
}

export { Skeleton }
