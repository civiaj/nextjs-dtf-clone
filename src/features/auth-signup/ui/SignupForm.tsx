'use client'

import { useSignup } from '@/features/auth-signup/model/hooks/useSignup'
import { Button } from '@/shared/ui/button'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
    PasswordField
} from '@/shared/ui/form'
import { Input } from '@/shared/ui/input'

export const SignupForm = ({ onSuccess }: { onSuccess?: () => void }) => {
    const { form, isLoading, signup } = useSignup(onSuccess)

    return (
        <Form {...form}>
            <form
                onSubmit={signup}
                className='flex flex-col gap-3'>
                <div className='flex flex-col gap-2'>
                    <FormField
                        control={form.control}
                        name='name'
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        placeholder='Имя или название'
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='email'
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        {...field}
                                        placeholder='Электронная почта'
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <PasswordField
                        control={form.control}
                        name='password'
                        label='Пароль'
                    />
                    <PasswordField
                        control={form.control}
                        name='confirmPassword'
                        label='Подтверждение пароля'
                    />
                </div>
                <Button
                    isLoading={isLoading}
                    disabled={isLoading}
                    type='submit'>
                    Создать
                </Button>
            </form>
        </Form>
    )
}
