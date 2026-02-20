import { NextRequest, NextResponse } from 'next/server'
import { reactionService } from '@/server/composition-root'
import { AuthContext } from '@/server/context'
import { TResponseBase } from '@/shared/types'
import { TReactionMetrics } from '@/shared/types/reaction.types'
import { updateReactionSchema } from '@/shared/validation/reaction.schema'

export class ReactionController {
    public static async update(
        req: NextRequest
    ): Promise<NextResponse<TResponseBase<TReactionMetrics>>> {
        const body = await req.json()
        const data = updateReactionSchema.parse(body)

        const user = await AuthContext.getCurrentUser()
        const result = await reactionService.update({ ...data, userId: user.id })

        return NextResponse.json({ message: 'success', result })
    }

    public static async getAssets(_req: NextRequest) {
        await AuthContext.getCurrentUser()
        const result = await reactionService.getAssets()
        return NextResponse.json({ result, message: 'success' })
    }
}
