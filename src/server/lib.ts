'use server'

import { notFound } from 'next/navigation'
import { AuthContext } from '@/server/context'
import { TResponseBase } from '@/shared/types'
import { ACCESS_TOKEN } from './constants'

export const httpClient = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
    const url = `${process.env.NEXT_PUBLIC_APP_URL}/api${endpoint}`
    const headers = new Headers(options.headers || {})
    const { cookies } = await AuthContext.getRequestContext()
    const accessToken = cookies.get(ACCESS_TOKEN.key)?.value

    if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`)

    const data = (await fetch(url, { cache: 'no-cache', ...options, headers }).then((res) => {
        return res.json()
    })) as TResponseBase<T>

    if (!data.result) return notFound()
    return data.result
}
