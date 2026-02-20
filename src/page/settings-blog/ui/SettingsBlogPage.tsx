'use client'

import { AuthGuard } from '@/entities/auth'
import { SettingsBlogPageContent } from './SettingsBlogPageContent'

export const SettingsBlogPage = () => {
    return (
        <AuthGuard>
            <SettingsBlogPageContent />
        </AuthGuard>
    )
}
