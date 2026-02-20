'use client'

import { LucideProps } from 'lucide-react'
import { toast as sonnerToast, Toaster as SonnerToaster } from 'sonner'
import { AlertAppIcon, BellAppIcon, CircleCheckAppIcon, CloseAppIcon } from '@/shared/icons'
import { Button } from '@/shared/ui/button'
import { Text } from '@/shared/ui/text'
import { cn } from '@/shared/utils/common.utils'

export const showToast = (type: ToastTypes, data: ShowToastData) => {
    return toastMessages[type](data)
}

export const Toaster = () => {
    return (
        <SonnerToaster
            position='top-right'
            offset={{ top: 56 + 16 }}
            mobileOffset={{ top: 56 + 8 }}
        />
    )
}

function toast(toast: ToastProps) {
    return sonnerToast.custom(
        (id) => (
            <Toast
                {...toast}
                id={toast?.id ?? id}
            />
        ),
        { duration: 5000 }
    )
}

function Toast(props: ToastProps) {
    const { description, id, type, action, actionLabel = 'Отмена' } = props
    const Icon = toastIcons[type]

    const onActionClick = () => {
        sonnerToast.dismiss(id)
        action?.()
    }

    return (
        <div className='relative w-full rounded-xl !bg-white shadow-md sm:max-w-[800px] md:min-w-80'>
            <div className='flex flex-col gap-2 p-3'>
                <div className='flex gap-2'>
                    <Icon
                        size={24}
                        className={cn('shrink-0', {
                            ['text-green-500']: type === 'success',
                            ['text-destructive']: type === 'warning',
                            ['text-foreground']: type === 'notification'
                        })}
                    />

                    <Text
                        as='p'
                        className='flex-1 font-medium'>
                        {description}
                    </Text>

                    <Button
                        onClick={() => sonnerToast.dismiss(id)}
                        className='shrink-0'
                        size={'icon-sm'}
                        variant={'ghost'}>
                        <CloseAppIcon size={16} />
                    </Button>
                </div>
                {action && (
                    <Button
                        className='shrink-0 self-end'
                        rounedness={'full'}
                        variant={'outline'}
                        size={'sm'}
                        onClick={onActionClick}>
                        {actionLabel}
                    </Button>
                )}
            </div>
        </div>
    )
}

interface ToastProps {
    id?: string | number
    description: string
    type: ToastTypes
    action?: () => void
    actionLabel?: string
}
type ShowToastData = Omit<ToastProps, 'type'>
type ToastTypes = 'success' | 'warning' | 'notification'

const toastMessages: Record<ToastTypes, (data: ShowToastData) => void> = {
    warning: (data) => toast({ type: 'warning', ...data }),
    notification: (data) => toast({ type: 'notification', ...data }),
    success: (data) => toast({ type: 'success', ...data })
}

const toastIcons: Record<ToastTypes, React.ComponentType<LucideProps>> = {
    warning: AlertAppIcon,
    notification: BellAppIcon,
    success: CircleCheckAppIcon
}
