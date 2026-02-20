import { useId } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useAppSelector } from '@/lib/store'
import { PATH } from '@/shared/constants'
import { Button } from '@/shared/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/shared/ui/form'
import { Input, TextArea } from '@/shared/ui/input'
import { SettingsField, SettingsLayout, SettingsSection } from '@/shared/ui/settings'
import { patchUserSchema } from '@/shared/validation/user.schema'
import { useUpdateOwnerBlog } from '../hooks/useUpdateOwnerBlog'

const settingsBlogSchema = patchUserSchema.pick({
    description: true,
    name: true
})
type TSettingsBlogFormInput = {
    description: string
    name: string
}

export const SettingsBlogPageContent = () => {
    const name = useAppSelector((state) => state.auth.currentUser?.name ?? '')
    const description = useAppSelector((state) => state.auth.currentUser?.description ?? '')

    return (
        <SettingsBlogPageContentForm
            key={`${name}::${description}`}
            initialName={name}
            initialDescription={description}
        />
    )
}

type TSettingsBlogPageContentFormProps = {
    initialName: string
    initialDescription: string
}

const SettingsBlogPageContentForm = ({
    initialName,
    initialDescription
}: TSettingsBlogPageContentFormProps) => {
    const formId = useId()
    const initialForm: TSettingsBlogFormInput = {
        description: initialDescription,
        name: initialName
    }

    const form = useForm<TSettingsBlogFormInput>({
        resolver: zodResolver(settingsBlogSchema),
        mode: 'onChange',
        defaultValues: initialForm
    })

    const values = form.watch()
    const isChanged =
        values.name?.trim() !== initialForm.name.trim() ||
        values.description?.trim() !== initialForm.description.trim()

    const { isLoading, execute } = useUpdateOwnerBlog()

    const handleUpdate = form.handleSubmit((values) => {
        execute(values, {
            onSuccess: ({ description, name }) => {
                const nextForm = { description: description ?? '', name: name ?? '' }
                form.reset(nextForm)
            }
        })
    })

    return (
        <SettingsLayout
            title='Блог'
            subtitle='Публичная информация о профиле'
            backHref={PATH.SETTINGS}
            action={
                <Button
                    size='md'
                    title='Сохранить'
                    variant='active'
                    type='submit'
                    form={formId}
                    disabled={!isChanged || !form.formState.isValid}
                    isLoading={isLoading}>
                    Сохранить
                </Button>
            }>
            <Form {...form}>
                <form
                    id={formId}
                    onSubmit={handleUpdate}>
                    <SettingsSection>
                        <SettingsField
                            label='Название блога'
                            description='Короткий и понятный заголовок профиля.'>
                            <FormField
                                control={form.control}
                                name='name'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </SettingsField>

                        <SettingsField
                            label='Описание'
                            description='Пара строк о тематике вашего блога.'>
                            <FormField
                                control={form.control}
                                name='description'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <TextArea
                                                {...field}
                                                placeholder='Тут будут умные мысли… иногда'
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </SettingsField>
                    </SettingsSection>
                </form>
            </Form>
        </SettingsLayout>
    )
}
