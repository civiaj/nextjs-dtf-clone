import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies'
import { cookies as nextCookies, headers as nextHeaders } from 'next/headers'
import { userAgent as nextUserAgent } from 'next/server'
import { ApiError } from '@/lib/error'
import { tokenService, userService } from '@/server/composition-root'
import { ACCESS_TOKEN, REFRESH_TOKEN } from '@/server/constants'
import { ERROR_MESSAGES } from '@/shared/constants'
import { TDeviceInfo } from '@/shared/types'

export class AuthContext {
    public static async getCurrentUser() {
        const { cookies, headers, deviceInfo } = await this.getRequestContext()
        const access = cookies.get(ACCESS_TOKEN.key)?.value
        const refresh = cookies.get(REFRESH_TOKEN.key)?.value

        const authHeader = headers.get('Authorization')
        const bearer = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null

        if (access) {
            try {
                const token = await tokenService.verify(access, 'access')
                const user = await userService.getById(token.user.id)
                if (user) return user
            } catch {}
        }

        if (bearer) {
            try {
                const token = await tokenService.verify(bearer, 'access')
                const user = await userService.getById(token.user.id)
                if (user) return user
            } catch {}
        }

        if (refresh) {
            const { tokens, userId } = await tokenService.refresh(refresh, deviceInfo)
            await this.setAuthCookies(cookies, tokens)

            const user = await userService.getById(userId)
            if (!user) throw ApiError.Unauthorized(ERROR_MESSAGES.USER.TOKEN_NOT_FOUND)

            return user
        }

        throw ApiError.Unauthorized(ERROR_MESSAGES.USER.TOKEN_NOT_FOUND)
    }

    public static async getCurrentUserOrNull() {
        try {
            return await this.getCurrentUser()
        } catch {
            return null
        }
    }

    public static async getRequestContext() {
        const headers = await nextHeaders()
        const cookies = await nextCookies()
        const { os, browser, ua } = await nextUserAgent({ headers })
        const deviceInfo: TDeviceInfo = { os, browser, ua }

        return {
            cookies,
            headers,
            deviceInfo
        }
    }

    public static async setAuthCookies(
        cookies: ReadonlyRequestCookies,
        {
            accessToken,
            refreshToken
        }: {
            accessToken: string
            refreshToken: string
        }
    ) {
        cookies.set(ACCESS_TOKEN.key, accessToken, ACCESS_TOKEN.options)
        cookies.set(REFRESH_TOKEN.key, refreshToken, REFRESH_TOKEN.options)
    }

    public static async removeAuthCookies(cookies: ReadonlyRequestCookies) {
        cookies.delete(ACCESS_TOKEN.key)
        cookies.delete(REFRESH_TOKEN.key)
    }
}
