import { NextRequest, NextResponse } from 'next/server'
import { ApiError } from '@/lib/error'
import { tokenService, userService } from '@/server/composition-root'
import { REFRESH_TOKEN } from '@/server/constants'
import { AuthContext } from '@/server/context'
import { ERROR_MESSAGES } from '@/shared/constants'
import { TResponseBase } from '@/shared/types'
import { TUser } from '@/shared/types/user.types'
import { loginSchema, signUpSchema } from '@/shared/validation/user.schema'
import { comparePassword } from './utils/comparePassword'

export class AuthController {
    static async login(req: NextRequest): Promise<NextResponse<TResponseBase<TUser>>> {
        const body = await req.json()
        const { success, data, error } = loginSchema.safeParse(body)

        if (!success) throw error

        const contender = await userService.getPrivateUser(data.email)
        if (!contender) throw ApiError.NotFound(ERROR_MESSAGES.USER.EMAIL_NOT_FOUND)

        const isValid = comparePassword(data.password, contender.password)
        if (!isValid) throw ApiError.NotFound(ERROR_MESSAGES.USER.EMAIL_NOT_FOUND)

        const user = await userService.getById(contender.id)
        if (!user) throw ApiError.Unauthorized(ERROR_MESSAGES.USER.EMAIL_NOT_FOUND)

        const { deviceInfo, cookies } = await AuthContext.getRequestContext()
        const tokens = await tokenService.create(user.id, deviceInfo)

        await AuthContext.setAuthCookies(cookies, tokens)
        return NextResponse.json({ result: user, message: 'success' })
    }

    static async signup(req: NextRequest): Promise<NextResponse<TResponseBase<TUser>>> {
        const body = await req.json()
        const { success, data, error } = signUpSchema.safeParse(body)

        if (!success) throw error

        const { deviceInfo, cookies } = await AuthContext.getRequestContext()
        const user = await userService.createRegular(data)
        const tokens = await tokenService.create(user.id, deviceInfo)

        await AuthContext.setAuthCookies(cookies, tokens)
        return NextResponse.json({ result: user, message: 'success' })
    }

    static async logout(_req: NextRequest): Promise<NextResponse<TResponseBase<null>>> {
        const { cookies } = await AuthContext.getRequestContext()

        try {
            const refreshToken = cookies.get(REFRESH_TOKEN.key)?.value
            if (!refreshToken) {
                throw ApiError.BadRequest(ERROR_MESSAGES.USER.TOKEN_NOT_FOUND)
            }

            const token = await tokenService.verify(refreshToken, 'refresh')
            await tokenService.revoke(token.user.id, token.id)
        } catch {}

        await AuthContext.removeAuthCookies(cookies)
        return NextResponse.json({ result: null, message: 'success' })
    }

    static async refresh(_req: NextRequest): Promise<NextResponse<TResponseBase<null>>> {
        const { cookies, deviceInfo } = await AuthContext.getRequestContext()
        const refreshToken = cookies.get(REFRESH_TOKEN.key)?.value

        if (!refreshToken) {
            throw ApiError.Unauthorized(ERROR_MESSAGES.USER.TOKEN_NOT_FOUND)
        }

        const { tokens } = await tokenService.refresh(refreshToken, deviceInfo)

        console.log('refresh', { tokens })

        await AuthContext.setAuthCookies(cookies, tokens)
        return NextResponse.json({ result: null, message: 'success' })
    }
}
