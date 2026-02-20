import { NextRequest, NextResponse } from 'next/server'
import { ApiError } from '@/lib/error'
import { mediaService, userService } from '@/server/composition-root'
import { AuthContext } from '@/server/context'
import { ERROR_MESSAGES } from '@/shared/constants'
import { TResponseBase } from '@/shared/types'
import { TUser } from '@/shared/types/user.types'
import {
    getUserSchema,
    getUsersSchema,
    patchUserSchema,
    searchUserSchema
} from '@/shared/validation/user.schema'

export class UserController {
    public static async getById(
        _req: NextRequest,
        params: object
    ): Promise<NextResponse<TResponseBase<TUser>>> {
        const { success, data, error } = getUserSchema.safeParse(params)

        if (!success) throw error

        const user = await AuthContext.getCurrentUserOrNull()
        const result = await userService.getById(data.id, user?.id)

        return NextResponse.json({ result, message: 'success' })
    }

    public static async getUsers(req: NextRequest) {
        const params = Object.fromEntries(req.nextUrl.searchParams.entries())
        const dto = getUsersSchema.parse(params)
        const type = dto.type
        let result: { items: TUser[]; cursor: number | null } = { items: [], cursor: null }

        switch (type) {
            case 'owner-muted-users': {
                const user = await AuthContext.getCurrentUser()
                result = await userService.getOwnerMutedUsers(dto, user.id)
                break
            }
            case 'user-followers': {
                const user = await AuthContext.getCurrentUserOrNull()
                result = await userService.getUserFollowers(dto, user?.id)

                console.log({ items: result.items })
                break
            }
            case 'user-subscriptions': {
                const user = await AuthContext.getCurrentUserOrNull()
                result = await userService.getUserSubscriptions(dto, user?.id)
                break
            }
            default: {
                console.warn(`Unknown type: ${type satisfies never}`)
            }
        }

        return NextResponse.json({ message: 'success', result })
    }

    public static async search(req: NextRequest) {
        const queryParams = Object.fromEntries(req.nextUrl.searchParams.entries())
        const { success, data, error } = searchUserSchema.safeParse(queryParams)

        if (!success) throw error

        const user = await AuthContext.getCurrentUser()
        const result = await userService.search(data.query, user.id)

        return NextResponse.json({ message: 'success', result })
    }

    public static async patchRegular(
        req: NextRequest
    ): Promise<NextResponse<TResponseBase<TUser>>> {
        const body = await req.json()
        const { success, data, error } = patchUserSchema.safeParse(body)

        if (!success) throw error

        if (data.avatarId) {
            const exist = await mediaService.findById(data.avatarId)
            if (!exist) throw ApiError.BadRequest(ERROR_MESSAGES.MEDIA.NOT_FOUND)
        }

        if (data.coverId) {
            const exist = await mediaService.findById(data.coverId)
            if (!exist) throw ApiError.BadRequest(ERROR_MESSAGES.MEDIA.NOT_FOUND)
        }

        const user = await AuthContext.getCurrentUser()
        const result = await userService.updateRegular(user.id, data)

        return NextResponse.json({ result, message: 'success' })
    }

    public static async _createTestUsers(_req: NextRequest) {
        if (process.env.NODE_ENV !== 'development')
            throw ApiError.NotAllowed('This endpoint is available only in development mode')

        for (let i = 0; i < 100; i++) {
            try {
                const random = Math.random()
                await userService.createRegular({
                    email: `test-email${random}@test.ru`,
                    name: `Test ${random}`,
                    password: '123123',
                    confirmPassword: '123123'
                })
            } catch {}
        }

        return NextResponse.json({ message: 'success' })
    }
}
