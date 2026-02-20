'use client'

import { AuthGuard } from '@/entities/auth'
import { UnmuteUserButton } from '@/features/mute'
import { PATH } from '@/shared/constants'
import { ContainerPadding } from '@/shared/ui/box'
import { SettingsField, SettingsLayout, SettingsSection } from '@/shared/ui/settings'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs'
import { PublishedPostList } from '@/widgets/post-published'
import { UsersList } from '@/widgets/users-list'
import { DefaultFeedSetter } from './DefaultFeed'

export const SettingsFeedPage = () => {
    return (
        <AuthGuard>
            <SettingsFeedPageContent />
        </AuthGuard>
    )
}

const SettingsFeedPageContent = () => {
    return (
        <>
            <SettingsLayout
                title='Лента'
                subtitle='Персонализация и контроль контента'
                backHref={PATH.SETTINGS}>
                <SettingsSection>
                    <SettingsField
                        label='Лента по умолчанию'
                        description='Выберите, какой раздел открывать первым на главной странице.'>
                        <DefaultFeedSetter />
                    </SettingsField>
                </SettingsSection>
            </SettingsLayout>

            <Tabs defaultValue='users'>
                <SettingsLayout title='Скрытый контент'>
                    <ContainerPadding>
                        <TabsList className='w-full'>
                            <TabsTrigger
                                value='users'
                                className='w-full text-sm'>
                                Пользователи
                            </TabsTrigger>
                            <TabsTrigger
                                value='posts'
                                className='w-full text-sm'>
                                Посты
                            </TabsTrigger>
                        </TabsList>
                    </ContainerPadding>
                </SettingsLayout>
                <TabsContent value='users'>
                    <UsersList
                        type='owner-muted-users'
                        mode='container'
                        itemVariant='container'
                        action={(user) => (
                            <UnmuteUserButton
                                id={user.id}
                                title={`Разблокировать ${user.name}`}
                            />
                        )}
                    />
                </TabsContent>
                <TabsContent value='posts'>
                    <PublishedPostList type='owner-muted-posts' />
                </TabsContent>
            </Tabs>
        </>
    )
}
