import { forwardRef } from 'react'
import { LucideIcon } from 'lucide-react'
import { buttonVariants } from '@/shared/ui/button'
import { Text } from '@/shared/ui/text'
import { cn } from '@/shared/utils/common.utils'

export const MetricsButton = forwardRef<
    HTMLButtonElement,
    {
        count: number
        Icon: LucideIcon
        isActive: boolean
    } & React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ count, Icon, isActive, className, ...props }, ref) => {
    return (
        <button
            ref={ref}
            className={cn(
                'group flex items-center transition-colors',
                {
                    ['text-active']: isActive
                },
                className
            )}
            {...props}>
            <div
                className={cn(
                    buttonVariants({ size: 'icon-md', rounedness: 'full', variant: 'ghost' }),
                    'group-hover:bg-active/10 group-hover:text-active'
                )}>
                <Icon size={20} />
            </div>

            {count > 0 && (
                <Text
                    as='span'
                    className='ml-[2px] font-medium transition-colors group-hover:text-active'>
                    {count}
                </Text>
            )}
        </button>
    )
})

MetricsButton.displayName = 'MetricsButton'
