import { PATH } from '@/shared/constants'
import { FeedSettingsAppIcon, SettingsAppIcon, UserAppIcon } from '@/shared/icons'
import { SettingsLayout, SettingsLinkCard } from '@/shared/ui/settings'

export const SettingsPage = () => {
    return (
        <SettingsLayout
            title='Настройки'
            withBottom={false}>
            <div className='p-2'>
                {SETTINGS_SECTIONS.map(({ description, href, label, Icon }) => (
                    <SettingsLinkCard
                        key={href}
                        href={href}
                        label={label}
                        description={description}
                        Icon={Icon}
                    />
                ))}
            </div>
        </SettingsLayout>
    )
}

const SETTINGS_SECTIONS = [
    {
        label: 'Блог',
        description: 'Название блога, описание и публичная информация',
        href: PATH.SETTINGS_BLOG,
        Icon: UserAppIcon
    },
    {
        label: 'Лента',
        description: 'Лента по умолчанию и управление заблокированным контентом',
        href: PATH.SETTINGS_FEED,
        Icon: FeedSettingsAppIcon
    },
    {
        label: 'Основные',
        description: 'Безопасность, приватность и управление аккаунтом',
        href: PATH.SETTINGS_GENERAL,
        Icon: SettingsAppIcon
    }
]
