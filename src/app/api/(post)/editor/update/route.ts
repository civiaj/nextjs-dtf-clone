import { NextRequest } from 'next/server'
import { apiErrorHandler } from '@/lib/error'
import { PostController } from '@/server/post'

export async function POST(req: NextRequest) {
    try {
        return await PostController.update(req)
    } catch (error) {
        console.log({ error })
        return apiErrorHandler(error)
    }
}
