'use client'

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
import { useLogin } from '../model/hooks/useLogin'

export const LoginForm = ({ onSuccess }: { onSuccess?: () => void }) => {
    const { form, isLoading, login } = useLogin(onSuccess)

    return (
        <Form {...form}>
            <form
                onSubmit={login}
                className='flex flex-col gap-3'>
                <div className='flex flex-col gap-2'>
                    <FormField
                        control={form.control}
                        name='email'
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        placeholder='Электронная почта'
                                        {...field}
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
                </div>
                <Button
                    isLoading={isLoading}
                    type='submit'>
                    Войти
                </Button>
            </form>
        </Form>
    )
}
