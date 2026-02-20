import { useAppSelector } from '@/lib/store'
import { useGetAssetsQuery } from '../service'

export const useGetAssets = () => {
    const isRefreshAttempted = useAppSelector((state) => state.auth.isRefreshAttempted)
    const { data } = useGetAssetsQuery(undefined, { skip: !isRefreshAttempted })
    return { data }
}
