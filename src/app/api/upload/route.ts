import { NextRequest } from 'next/server'
import { apiErrorHandler } from '@/lib/error'
import { MediaController } from '@/server/media/controller'

export async function POST(req: NextRequest) {
    try {
        return await MediaController.upload(req)
    } catch (error) {
        return apiErrorHandler(error)
    }
}
