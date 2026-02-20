import { NextRequest } from 'next/server'
import { apiErrorHandler } from '@/lib/error'
import { CommentController } from '@/server/comment'

export async function GET(req: NextRequest) {
    try {
        return await CommentController._createTestComments(req)
    } catch (error) {
        return apiErrorHandler(error)
    }
}
