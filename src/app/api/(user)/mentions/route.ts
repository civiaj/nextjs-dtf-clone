import { NextRequest } from 'next/server'
import { apiErrorHandler } from '@/lib/error'
import { UserController } from '@/server/user'

export async function GET(req: NextRequest) {
    try {
        return await UserController.search(req)
    } catch (error) {
        return apiErrorHandler(error)
    }
}
