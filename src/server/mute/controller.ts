import { NextRequest, NextResponse } from 'next/server'
import { muteService } from '@/server/composition-root'
import { AuthContext } from '@/server/context'
import { TResponseBase } from '@/shared/types'
import { createMuteSchema } from '@/shared/validation/mute.schema'

export class MuteController {
    static async update(req: NextRequest): Promise<NextResponse<TResponseBase<null>>> {
        const [body, user] = await Promise.all([req.json(), AuthContext.getCurrentUser()])
        const data = createMuteSchema.parse(body)
        await muteService.update({ ...data, userId: user.id })
        return NextResponse.json({ result: null, message: 'success' })
    }
}
