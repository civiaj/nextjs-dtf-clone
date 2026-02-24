import { useAppSelector } from '@/lib/store'
import { getResolvedTheme } from '../model/slice'

export const useAppTheme = () => {
    const theme = useAppSelector((state) => state.ui.theme)
    return getResolvedTheme(theme)
}
