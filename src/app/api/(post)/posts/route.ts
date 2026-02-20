import { NextRequest } from 'next/server'
import { apiErrorHandler } from '@/lib/error'
import { PostController } from '@/server/post'

export async function GET(req: NextRequest) {
    try {
        return await PostController.getPosts(req)
    } catch (error) {
        return apiErrorHandler(error)
    }
}

export async function DELETE(req: NextRequest) {
    try {
        return await PostController.delete(req)
    } catch (error) {
        return apiErrorHandler(error)
    }
}
