export const APP_THEMES = ['dark', 'light', 'system'] as const
export const APP_THEMES_OPTIONS: AppThemeOption[] = [
    { label: 'Темная', value: 'dark' },
    { label: 'Светлая', value: 'light' },
    { label: 'Системная', value: 'system' }
]

export type AppTheme = (typeof APP_THEMES)[number]
export type AppThemeOption = { value: AppTheme; label: string }
