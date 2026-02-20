import { NextRequest } from 'next/server'
import { apiErrorHandler } from '@/lib/error'
import { FollowUserController } from '@/server/follow-user'

export async function GET(req: NextRequest) {
    try {
        // await UserController._createTestUsers(req)
        return await FollowUserController._createTestFollowers(req)
    } catch (error) {
        return apiErrorHandler(error)
    }
}
