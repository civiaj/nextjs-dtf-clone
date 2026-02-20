import { Metadata } from 'next'
import { SettingsFeedPage } from '@/page/settings-feed'

export const metadata: Metadata = {
    title: 'Настройки ленты'
}

export default function Page() {
    return <SettingsFeedPage />
}
