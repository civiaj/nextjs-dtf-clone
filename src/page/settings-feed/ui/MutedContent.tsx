'use client'

import dynamic from 'next/dynamic'
import { ContainerPadding } from '@/shared/ui/box'
import { SettingsSection } from '@/shared/ui/settings'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs'
import { Text } from '@/shared/ui/text'

const UsersList = dynamic(() => import('@/widgets/users-list').then((module) => module.UsersList), {
    loading: () => (
        <Text
            as='p'
            size='sm'
            className='text-muted-foreground'>
            Загрузка пользователей...
        </Text>
    )
})

const PublishedPostList = dynamic(
    () => import('@/widgets/post-published').then((module) => module.PublishedPostList),
    {
        loading: () => (
            <Text
                as='p'
                size='sm'
                className='text-muted-foreground'>
                Загрузка постов...
            </Text>
        )
    }
)

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
                <PublishedPostList type='owner-muted-posts' />
            </TabsContent>
        </Tabs>
    )
}
