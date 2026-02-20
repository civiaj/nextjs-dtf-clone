import { AuthGuard } from '@/entities/auth'
import { PATH } from '@/shared/constants'
import { Button } from '@/shared/ui/button'
import { SettingsField, SettingsLayout, SettingsSection } from '@/shared/ui/settings'

export const SettingsGeneralPage = () => {
    return (
        <AuthGuard>
            <SettingsLayout
                title='Основные'
                backHref={PATH.SETTINGS}>
                <SettingsSection
                    title='Безопасность'
                    description='Быстрые настройки для защиты аккаунта.'>
                    <SettingsField
                        label='Пароль'
                        description='Обновите пароль, если давно не меняли его.'>
                        <Button
                            variant='outline'
                            size='md'
                            className='w-fit'>
                            Сменить пароль
                        </Button>
                    </SettingsField>
                </SettingsSection>

                <SettingsSection
                    title='Приватность'
                    description='Управление видимостью и уведомлениями.'>
                    <SettingsField
                        label='Видимость профиля'
                        description='Скоро появятся дополнительные параметры приватности.'>
                        <Button
                            variant='outline'
                            size='md'
                            className='w-fit'
                            disabled>
                            В разработке
                        </Button>
                    </SettingsField>
                </SettingsSection>

                <SettingsSection
                    title='Опасная зона'
                    description='Действия ниже нельзя отменить.'>
                    <SettingsField
                        label='Удаление аккаунта'
                        description='Профиль, публикации и подписки будут удалены без возможности восстановления.'>
                        <Button
                            variant='destructive'
                            size='md'
                            className='w-fit'>
                            Удалить аккаунт
                        </Button>
                    </SettingsField>
                </SettingsSection>
            </SettingsLayout>
        </AuthGuard>
    )
}
