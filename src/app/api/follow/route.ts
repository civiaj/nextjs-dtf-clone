import { NextRequest } from 'next/server'
import { apiErrorHandler } from '@/lib/error'
import { FollowUserController } from '@/server/follow-user'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
    try {
        return await FollowUserController.update(req)
    } catch (error) {
        return apiErrorHandler(error)
    }
}
