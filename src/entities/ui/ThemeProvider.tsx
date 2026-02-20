import { useEffect } from 'react'
import { getResolvedTheme, TTheme } from '@/entities/ui/slice'
import { useAppDispatch, useAppSelector } from '@/lib/store'

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const dispatch = useAppDispatch()
    const theme = useAppSelector((state) => state.ui.theme)

    useEffect(() => {
        const applyTheme = (themeToApply: TTheme) => {
            const nextTheme = getResolvedTheme(themeToApply)
            document.documentElement.setAttribute('data-theme', nextTheme)
            document.documentElement.classList.toggle('dark', nextTheme === 'dark')
            document.documentElement.classList.toggle('light', nextTheme === 'light')
        }
        applyTheme(theme)
    }, [theme, dispatch])

    return children
}
