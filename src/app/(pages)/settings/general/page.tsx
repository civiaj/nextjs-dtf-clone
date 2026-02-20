import { Metadata } from 'next'
import { SettingsGeneralPage } from '@/page/settings-general'

export const metadata: Metadata = {
    title: 'Основные настройки  '
}

export default function Page() {
    return <SettingsGeneralPage />
}
