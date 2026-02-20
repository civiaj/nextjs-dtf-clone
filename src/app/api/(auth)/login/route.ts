import { NextRequest } from 'next/server'
import { apiErrorHandler } from '@/lib/error'
import { AuthController } from '@/server/token'

export async function POST(req: NextRequest) {
    try {
        return await AuthController.login(req)
    } catch (error) {
        return apiErrorHandler(error)
    }
}
