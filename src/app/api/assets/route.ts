import { NextRequest } from 'next/server'
import { apiErrorHandler } from '@/lib/error'
import { AssetsController } from '@/server/assets'

export async function GET(req: NextRequest) {
    try {
        return await AssetsController.getAll(req)
    } catch (error) {
        return apiErrorHandler(error)
    }
}
