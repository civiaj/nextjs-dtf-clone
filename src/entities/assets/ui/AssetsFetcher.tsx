'use client'

import { useGetAssets } from '../model/hooks/useGetAssets'

export const AssetsFetcher = () => {
    useGetAssets()
    return null
}
