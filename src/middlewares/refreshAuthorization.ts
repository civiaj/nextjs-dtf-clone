import { NextResponse } from 'next/server'
import { AppMiddleware } from '@/middlewares/types'
// import { removeAuthCookies, setAuthCookies } from '@/modules/auth'

export const refreshAuthorization: AppMiddleware = async (req, res, _event) => {
    // const accessToken = req.cookies.get(ACCESS_TOKEN.key)?.value
    // const refreshToken = req.cookies.get(REFRESH_TOKEN.key)?.value

    let response = await res
    if (!res) response = NextResponse.next()

    // const requestHeaders = new Headers(req.headers)
    // const originalRequest = new Request(req.url, {
    //     method: req.method,
    //     headers: requestHeaders,
    //     body: req.body,
    //     redirect: 'manual' // Prevent auto-redirects
    // })

    // const originalResponse = await fetch(originalRequest)

    // if (originalResponse.status === 401 && !accessToken && refreshToken) {
    //     console.log({ accessToken, refreshToken })
    //     const headers = new Headers(req.headers)
    //     headers.set('Bearer', `${REFRESH_TOKEN.key}=${refreshToken}`)

    //     const refreshResponse = await fetch('http://localhost:3000/api/refresh', {
    //         headers,
    //         method: 'POST',
    //         credentials: 'include'
    //     })

    //     if (refreshResponse.ok) {
    //         const { accessToken, refreshToken } = (await refreshResponse.json()) as {
    //             accessToken: string
    //             refreshToken: string
    //         }

    //         response?.cookies.set(ACCESS_TOKEN.key, accessToken, ACCESS_TOKEN.options)
    //         response?.cookies.set(REFRESH_TOKEN.key, refreshToken, REFRESH_TOKEN.options)
    //     } else {
    //         response?.cookies.delete('accessToken')
    //         response?.cookies.delete('refreshToken')
    //     }

    //     return response
    // }

    return response
}
