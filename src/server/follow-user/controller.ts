import { NextRequest, NextResponse } from 'next/server'
import { ApiError } from '@/lib/error'
import { followUserService } from '@/server/composition-root'
import { AuthContext } from '@/server/context'
import { prisma } from '@/shared/services/prisma'
import { TResponseBase } from '@/shared/types'
import {
    createTestFollowersSchema,
    updateUserFollowSchema
} from '@/shared/validation/follow.schema'

export class FollowUserController {
    public static async update(req: NextRequest): Promise<NextResponse<TResponseBase<null>>> {
        const body = await req.json()
        const data = updateUserFollowSchema.parse(body)
        const user = await AuthContext.getCurrentUser()

        switch (data.action) {
            case 'create': {
                await followUserService.create({ subscriberId: user.id, targetUserId: data.id })
                break
            }
            case 'remove': {
                await followUserService.remove({ subscriberId: user.id, targetUserId: data.id })
                break
            }
        }

        return NextResponse.json({ message: 'success', result: null })
    }

    public static async _createTestFollowers(req: NextRequest) {
        if (process.env.NODE_ENV !== 'development')
            throw ApiError.NotAllowed('This endpoint is available only in development mode')

        const params = Object.fromEntries(req.nextUrl.searchParams.entries())
        const { userId } = createTestFollowersSchema.parse(params)
        const users = await prisma.user.findMany({ where: { name: { startsWith: 'Test' } } })

        for (const user of users) {
            if (user.id === userId) continue
            try {
                await followUserService.create({ subscriberId: userId, targetUserId: user.id })
            } catch {}
        }

        return NextResponse.json({
            message: 'success',
            result: users.length - 1
        })
    }
}
