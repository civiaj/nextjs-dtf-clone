import { NextResponse } from 'next/server'
import { apiErrorHandler } from '@/lib/error'
import { AuthContext } from '@/server/context'

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const user = await AuthContext.getCurrentUser()
        return NextResponse.json({ result: user, message: 'success' })
    } catch (error) {
        return apiErrorHandler(error)
    }
}
