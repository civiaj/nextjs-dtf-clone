import { Metadata } from 'next'
import { SettingsBlogPage } from '@/page/settings-blog'

export const metadata: Metadata = {
    title: 'Настройки блога'
}

export default function Page() {
    return <SettingsBlogPage />
}
