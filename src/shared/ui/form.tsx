'use client'

import * as React from 'react'
import * as LabelPrimitive from '@radix-ui/react-label'
import { Slot } from '@radix-ui/react-slot'
import {
    Control,
    Controller,
    ControllerProps,
    FieldPath,
    FieldValues,
    FormProvider,
    Path,
    useFormContext
} from 'react-hook-form'
import { CircleAlertAppIcon, EyeCloseAppIcon, EyeOpenAppIcon } from '@/shared/icons'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { Text } from '@/shared/ui/text'
import { cn } from '@/shared/utils/common.utils'

const Form = FormProvider

type FormFieldContextValue<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
    name: TName
}

const FormFieldContext = React.createContext<FormFieldContextValue>({} as FormFieldContextValue)

const FormField = <
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
    ...props
}: ControllerProps<TFieldValues, TName>) => {
    return (
        <FormFieldContext.Provider value={{ name: props.name }}>
            <Controller {...props} />
        </FormFieldContext.Provider>
    )
}

const useFormField = () => {
    const fieldContext = React.useContext(FormFieldContext)
    const itemContext = React.useContext(FormItemContext)
    const { getFieldState, formState } = useFormContext()

    const fieldState = getFieldState(fieldContext.name, formState)

    if (!fieldContext) {
        throw new Error('useFormField should be used within <FormField>')
    }

    const { id } = itemContext

    return {
        id,
        name: fieldContext.name,
        formItemId: `${id}-form-item`,
        formDescriptionId: `${id}-form-item-description`,
        formMessageId: `${id}-form-item-message`,
        ...fieldState
    }
}

type FormItemContextValue = {
    id: string
}

const FormItemContext = React.createContext<FormItemContextValue>({} as FormItemContextValue)

const FormItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => {
        const id = React.useId()

        return (
            <FormItemContext.Provider value={{ id }}>
                <div
                    ref={ref}
                    className={cn('space-y-1', className)}
                    {...props}
                />
            </FormItemContext.Provider>
        )
    }
)
FormItem.displayName = 'FormItem'

const FormLabel = React.forwardRef<
    React.ElementRef<typeof LabelPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => {
    const { formItemId } = useFormField()

    return (
        <Label
            ref={ref}
            className={cn(className)}
            htmlFor={formItemId}
            {...props}
        />
    )
})
FormLabel.displayName = 'FormLabel'

const FormControl = React.forwardRef<
    React.ElementRef<typeof Slot>,
    React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
    const { error, formItemId, formDescriptionId, formMessageId } = useFormField()

    return (
        <Slot
            ref={ref}
            id={formItemId}
            aria-describedby={
                !error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`
            }
            aria-invalid={!!error}
            {...props}
        />
    )
})
FormControl.displayName = 'FormControl'

const FormDescription = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
    const { formDescriptionId } = useFormField()

    return (
        <p
            ref={ref}
            id={formDescriptionId}
            className={cn('text-[0.8rem] text-muted-foreground', className)}
            {...props}
        />
    )
})
FormDescription.displayName = 'FormDescription'

const FormMessage = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ children }, ref) => {
    const { error } = useFormField()
    const body = error ? String(error?.message) : children

    if (!body) {
        return null
    }

    return (
        <div
            ref={ref}
            className='flex items-center gap-1 text-destructive'>
            <CircleAlertAppIcon
                size={14}
                className='shrink-0'
            />
            <Text
                className='text-xs sm:text-sm'
                as='p'>
                {body}
            </Text>
        </div>
    )
})
FormMessage.displayName = 'FormMessage'

type Props<T extends FieldValues> = {
    control: Control<T>
    name: Path<T>
    label: string
    description?: string
}

export const PasswordField = <T extends FieldValues>(props: Props<T>) => {
    const { control, label, name } = props
    const [isShown, setIsShown] = React.useState(false)
    const toggle = React.useCallback(() => setIsShown((p) => !p), [])
    const title = isShown ? 'Скрыть пароль' : 'Показать пароль'
    const type = isShown ? 'text' : 'password'
    const icon = isShown ? (
        <EyeCloseAppIcon className='h-4 w-4' />
    ) : (
        <EyeOpenAppIcon className='h-4 w-4' />
    )

    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <div className='relative flex items-center gap-1'>
                        <FormControl>
                            <Input
                                placeholder={label}
                                type={type}
                                {...field}
                            />
                        </FormControl>
                        <Button
                            className='shrink-0'
                            title={title}
                            type='button'
                            variant={'outline'}
                            size={'icon-base'}
                            onClick={toggle}>
                            {icon}
                        </Button>
                    </div>

                    <FormMessage />
                </FormItem>
            )}
        />
    )
}

export {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    useFormField
}
