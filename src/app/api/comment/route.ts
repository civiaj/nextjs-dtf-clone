import { NextRequest } from 'next/server'
import { apiErrorHandler } from '@/lib/error'
import { CommentController } from '@/server/comment'

export async function POST(req: NextRequest) {
    try {
        return await CommentController.createOne(req)
    } catch (error) {
        return apiErrorHandler(error)
    }
}

export async function GET(req: NextRequest) {
    try {
        return await CommentController.getComments(req)
    } catch (error) {
        return apiErrorHandler(error)
    }
}

export async function DELETE(req: NextRequest) {
    try {
        return await CommentController.softDeleteOne(req)
    } catch (error) {
        return apiErrorHandler(error)
    }
}
