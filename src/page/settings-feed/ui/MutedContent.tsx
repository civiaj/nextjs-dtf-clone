'use client'

import { UnmutePostButton } from '@/features/mute'
import { ContainerPadding } from '@/shared/ui/box'
import { SettingsSection } from '@/shared/ui/settings'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs'
import { PublishedPostList } from '@/widgets/post-published'
import { UsersList } from '@/widgets/users-list'

export const MutedContent = () => {
    return (
        <Tabs defaultValue='USER'>
            <SettingsSection
                title='Заблокированное'
                description='Список пользователей и постов, которые вы скрыли из ленты.'>
                <TabsList className='grid h-auto w-full max-w-xs grid-cols-2 rounded-xl border border-border bg-secondary/40 p-1'>
                    <TabsTrigger value='USER'>Пользователи</TabsTrigger>
                    <TabsTrigger value='POST'>Посты</TabsTrigger>
                </TabsList>
            </SettingsSection>

            <TabsContent
                value='USER'
                className='mt-0'>
                <ContainerPadding withTop={false}>
                    <UsersList
                        type='owner-muted-users'
                        mode='container'
                    />
                </ContainerPadding>
            </TabsContent>

            <TabsContent
                value='POST'
                className='mt-0'>
                <PublishedPostList
                    type='owner-muted-posts'
                    showDefaultHeaderActions={false}
                    action={(post) => (
                        <UnmutePostButton
                            id={post.id}
                            title='Разблокировать пост'
                        />
                    )}
                />
            </TabsContent>
        </Tabs>
    )
}
