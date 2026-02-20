import { NextRequest } from 'next/server'
import { apiErrorHandler } from '@/lib/error'
import { BookmarkController } from '@/server/bookmark'

export async function POST(req: NextRequest) {
    try {
        return await BookmarkController.update(req)
    } catch (error) {
        return apiErrorHandler(error)
    }
}
