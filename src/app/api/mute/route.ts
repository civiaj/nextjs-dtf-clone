import { NextRequest } from 'next/server'
import { apiErrorHandler } from '@/lib/error'
import { MuteController } from '@/server/mute'

export async function POST(req: NextRequest) {
    try {
        return await MuteController.update(req)
    } catch (error) {
        return apiErrorHandler(error)
    }
}
