'use client'

import { useAppSelector } from '@/lib/store'
import { useRefreshQuery } from '../model/service'

export const OwnerFetcher = () => {
    const staleUser = useAppSelector((state) => state.auth.staleUser)
    useRefreshQuery(undefined, { skip: !Boolean(staleUser) })

    return null
}
