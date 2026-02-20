import { NextRequest } from 'next/server'
import { apiErrorHandler } from '@/lib/error'
import { PostController } from '@/server/post'

type RouteParams = { params: Promise<{ param: string }> }

const toPostQueryParam = (value: string): { id: string } | { slug: string } => {
    const numericValue = Number(value)
    const isSafePositiveInteger =
        Number.isSafeInteger(numericValue) && numericValue > 0 && String(numericValue) === value

    return isSafePositiveInteger ? { id: value } : { slug: value }
}

export async function GET(req: NextRequest, routeParams: RouteParams) {
    try {
        const params = await routeParams.params
        return await PostController.getPost(req, toPostQueryParam(params.param))
    } catch (error) {
        return apiErrorHandler(error)
    }
}
