import { NextRequest } from 'next/server'
import { apiErrorHandler } from '@/lib/error'
import { UserController } from '@/server/user'

export async function POST(req: NextRequest) {
    try {
        return await UserController.patchRegular(req)
    } catch (error) {
        return apiErrorHandler(error)
    }
}

export async function GET(req: NextRequest) {
    try {
        return await UserController.getUsers(req)
    } catch (error) {
        return apiErrorHandler(error)
    }
}
