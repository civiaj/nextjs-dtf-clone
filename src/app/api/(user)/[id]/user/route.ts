import { NextRequest } from 'next/server'
import { apiErrorHandler } from '@/lib/error'
import { UserController } from '@/server/user'

export async function GET(req: NextRequest, routeParams: { params: Promise<object> }) {
    try {
        const params = await routeParams.params
        return await UserController.getById(req, params)
    } catch (error) {
        return apiErrorHandler(error)
    }
}
