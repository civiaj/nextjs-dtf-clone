import { NextRequest } from 'next/server'
import { apiErrorHandler } from '@/lib/error'
import { ReactionController } from '@/server/reaction'

export async function POST(req: NextRequest) {
    try {
        return await ReactionController.update(req)
    } catch (error) {
        return apiErrorHandler(error)
    }
}
